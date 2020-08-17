import React, {useContext, useEffect, useState} from 'react';
import {navigate, Redirect, redirectTo} from "@reach/router";
import {AuthContext} from "../App";
import firebaseApp from "../FirebaseConfig"
import CircularSpinner from "./CircularSpinner"
import ProjectCard, {CreateProjectCard} from "./ProjectCard"

import UnknownAvatar from './assets/avatar-person.svg'
import makeRequestToApi from "../libs/fetchFromApi";

// Home TopBar Component
function AppBar(props) {

  const [clickedOnUser, setClickedOnUser] = useState(-1)

  const nameDisplayStyle = {
    float: "right",
  }

  const dropdownStyle = {
    position: "relative",
    display: "inline-display",
    float: "right",
  }

  const dropdownContentStyle = {
    display: (clickedOnUser > 0 ? "block" : "none"),
    position: "absolute",
    right: "40px",
    backgroundColor: "#f9f9f9",
    minWidth: "160px",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    borderRadius: "0 0 5px 5px",
    zIndex: "1",
  }

  const dropdownContentOptionStyle = {
    textAlign: "left",
    color: "black",
    padding: "12px 16px",
    textDecoration: "none",
    display: "block",
    cursor: "pointer"
  }

  const dropDownMenu = <div style={dropdownStyle}>
    <div style={dropdownContentStyle}>
      <a style={dropdownContentOptionStyle} href={"/terms"}>T&C</a>
      <a style={dropdownContentOptionStyle} href={"/privacy"}>Privacy Policy</a>
      <div style={dropdownContentOptionStyle} onClick={props.onLogOutFunc}>Sign Out</div>
    </div>
  </div>

  const onClickUser = () => {
    setClickedOnUser(-clickedOnUser)
  }

  return <>
    <div className="app-bar">
      <h2>Issuist</h2>
      <div style={nameDisplayStyle} onClick={onClickUser}>
        {props.fullname} &nbsp;
        <img style={{verticalAlign: "middle"}} height="30px" width="30px"
             src={props.photoURL ? props.photoURL : UnknownAvatar}
             alt={""}/>
        <br/>
      </div>
    </div>
    {dropDownMenu}</>
}


// Home Component
function Home() {
  const [isAuthenticated, setIsAuthenticated, user, setUser] = useContext(AuthContext)
  const [isLoadingProjects, setIsLoadingProject] = useState(true)
  const [projectList, setProjectList] = useState([])

  const onLogOut = async () => {
    await firebaseApp.auth.signOut()
    await setIsAuthenticated(false)
    await localStorage.removeItem("isAuthenticated")
    await navigate('/login')
  }

  // Sync auth-status with localStorage
  if (isAuthenticated === null) {
    firebaseApp.auth.onAuthStateChanged(a => {
      if (!localStorage.getItem("isAuthenticated")) {
        setIsAuthenticated(false)
      } else {
        if (a) {
          setUser(a)
          // Only run the below function when user is set.
          makeRequestToApi("http://localhost:8000/projects").then(response => {
            console.log("made request to projects")
            if (!response) {
              console.log("Empty Response")
            } else if (response.status === "LOGIN_NEEDED") {
              console.log("LOGIN NEEDED")
              onLogOut().then()
            } else if (response.status === "OK") {
              console.log("PROJECTS_RESPONSE_OK")
              if (localStorage.getItem("isAuthenticated") === "TRUE") {
                setIsAuthenticated(true)
                setProjectList(response.projects)
                setIsLoadingProject(false)
              }
            } else if (response.status === "FAIL") {
              console.log("Ran into error!", response.reason)
              onLogOut().then()
            } else {
              console.log("Unknown Status!")
            }
          })
        }
      }
    })
  } else if (isAuthenticated === false) {
    return <Redirect to='/login' noThrow/>
  } else if (isAuthenticated && projectList.length === 0) {
    makeRequestToApi("http://localhost:8000/projects").then(response => {
      if (response) {
        if (response.status === "LOGIN_NEEDED") {
          console.log("LOGIN NEEDED")
          onLogOut().then()
          setProjectList(response.projects)
          setIsLoadingProject(false)
        } else if (response.status === "OK") {
          if (localStorage.getItem("isAuthenticated") === "TRUE") {
            setProjectList(response.projects)
            setIsLoadingProject(false)
          } else {
            onLogOut().then()
          }
        } else if (response.status === "FAIL") {
          console.log("Ran into error!", response.reason)
          onLogOut().then()
        } else {
          console.log("Unknown Status!")
        }
      }
    })
  }

  return isAuthenticated ? (<div id="homepage">
    <AppBar fullname={user.displayName} onLogOutFunc={onLogOut}/>
    <div id="projects-section">
      <div className="header">
        Your Projects
      </div>
      <br/>

      <div id="project-list">
        {!isLoadingProjects ? <div>
          <CreateProjectCard/>

          {projectList.map(project => {
            return <ProjectCard key={project._id} project={project}/>
          })}
        </div> : <div>Loading ...</div>}
      </div>
    </div>
  </div>) : null
}

export default Home
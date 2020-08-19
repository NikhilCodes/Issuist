import React, {useContext, useEffect, useState} from 'react';
import {navigate, Redirect, redirectTo} from "@reach/router";
import {AuthContext} from "../App";
import firebaseApp from "../FirebaseConfig"
import CircularSpinner from "./CircularSpinner"
import ProjectCard, {CreateProjectCard} from "./ProjectCard"
import makeRequestToApi from "../libs/fetchFromApi";




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
  // onLogOut()

  // Sync auth-status with locaindex.lStorage
  if (isAuthenticated === null) {
    firebaseApp.auth.onAuthStateChanged(a => {
      if (!localStorage.getItem("isAuthenticated")) {
        setIsAuthenticated(false)
      } else if (a) {
        setUser(a)
        const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        // Only run the below function when user is set.
        makeRequestToApi((development ? "http://localhost:8000" : "") + "/api/projects", {}, user).then(response => {
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
    })
  } else if (isAuthenticated === false) {
    return <Redirect to='/login' noThrow/>
  } else if (isAuthenticated && projectList.length === 0) {
    const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    makeRequestToApi((development ? "http://localhost:8000" : "") + "/api/projects", {}, user).then(response => {
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
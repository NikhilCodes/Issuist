import React, {createContext, useState} from 'react';
import {navigate, Router} from '@reach/router'
import './App.css';
import Login from "./components/LoginPage";
import Home from "./components/HomePage"

import NotFound from "./components/NotFoundPage";
import {ProjectDetail} from "./components/ProjectDetailPage";
import firebaseApp from "./FirebaseConfig";
import UnknownAvatar from "./components/assets/avatar-person.svg";

export const AuthContext = createContext(null)


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState({})

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
        <h2 onClick={() => navigate('/')}>Issuist</h2>
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

  const onLogOut = async () => {
    await firebaseApp.auth.signOut()
    await setIsAuthenticated(false)
    await localStorage.removeItem("isAuthenticated")
    await navigate('/login')
  }

  return (
      <AuthContext.Provider value={[isAuthenticated, setIsAuthenticated, user, setUser]}>
        <div className="App">
          {isAuthenticated ? <AppBar fullname={user.displayName} onLogOutFunc={onLogOut}/> : null}
          <Router id="router">
            <Home path='/'/>
            <Login path='/login'/>
            <ProjectDetail path='/project/:projectId'/>
            <NotFound default/>
          </Router>
        </div>
      </AuthContext.Provider>
  )
}

export default App;

import React, {useContext, useState} from 'react';
import {navigate, Redirect} from "@reach/router";
import {AuthContext} from "../App";

import firebaseApp from "../FirebaseConfig";
import makeRequestToApi from "../libs/fetchFromApi";

function Login() {
  const [isAuthenticated, setIsAuthenticated, user, setUser] = useContext(AuthContext)
  const [loginMethod, setLoginMethod] = useState(1) // 1 for sign in, and -1 for sign up
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!(email && password) || (loginMethod === -1 && name === '')) {
      return;
    }

    if (loginMethod === 1) {
      // Login Task
      await firebaseApp.auth.signInWithEmailAndPassword(email, password).then(value => {
        setUser(value.user)
      }).catch(reason => {
        setErrors(reason.message)
        return null
      })
      //
    } else if (loginMethod === -1) {
      // Sign Up
      await firebaseApp.auth.createUserWithEmailAndPassword(email, password).then(value => {
        setUser(value.user)
        value.user.updateProfile({displayName: name})
        console.log("New User Created", user)
      }).catch(reason => {
        setErrors(reason.message)
        return null
      })
      //
    }
    const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

    const response = await makeRequestToApi((development ? "http://localhost:8000" : "") + "/api/login", {}, user)
    if (!response.success) {
      console.log("AUTH WITH API FAILED!")
      return null;
    }
    setIsAuthenticated(true)
    localStorage.setItem("isAuthenticated", "TRUE")

    if (errors) {
      console.log("Login Done:", user)
      await navigate('/')
    }
  }

  const handleChange = e => {
    if (e.currentTarget.name === 'email') {
      setEmail(e.currentTarget.value)
    } else if (e.currentTarget.name === 'password') {
      setPassword(e.currentTarget.value)
    } else if (e.currentTarget.name === 'full-name') {
      setName(e.currentTarget.value)
    }
  }

  const toggleLoginMethod = () => {
    setLoginMethod(-loginMethod)
  }

  if (isAuthenticated || isAuthenticated === null) return <Redirect to='/' noThrow/>

  return <div id="login-bg">
    <div id="login-form">
      <form>
        <div className="login-text-input">
          <div className="login-heading">
            {loginMethod === 1 ? "Sign In" : "Sign Up"}
          </div>
          <br/>
          {loginMethod === -1 ? <><input name="full-name" placeholder="John Watson" type="text" value={name}
                                         onChange={handleChange}/><br/><br/></> : null}
          <input name="email" placeholder="someone@email.com" type="email" value={email} onChange={handleChange}
                 autoComplete="email" required/> <br/><br/>
          <input name="password" placeholder="password" type="password" value={password} onChange={handleChange}
                 required/><br/><br/><br/>
        </div>
        <button className="login-submit-button" onClick={handleSubmit} type="submit">
          {loginMethod === 1 ? "SIGN IN" : "REGISTER"}
        </button>
      </form>
      <br/>
      <div id="error-text">{errors ? errors : <>&nbsp;</>}</div>
      <div style={{
        padding: "30px 50px",
        color: "#afafaf",
      }}>
        Or Login With
      </div>

      <button className="login-google-button" style={{
        backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg)"
      }}/>

      <br/><br/><br/><br/>
      {loginMethod === 1 ? "Not registered yet" : "Already a user"},
      <button className="login-switch-button" onClick={toggleLoginMethod}>
        {loginMethod === 1 ? "Sign Up" : "Sign In"}
      </button>
    </div>
  </div>
}

export default Login
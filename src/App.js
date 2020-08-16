import React, {createContext, useState} from 'react';
import {Router} from '@reach/router'
import './App.css';
import Login from "./components/LoginPage";
import Home from "./components/HomePage"

import NotFound from "./components/NotFoundPage";

export const AuthContext = createContext(null)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState({})
  return (
      <AuthContext.Provider value={[isAuthenticated, setIsAuthenticated, user, setUser]}>
        <div className="App">
          <Router id="router">
            <Home path='/'/>
            <Login path='/login'/>
            <NotFound default />
          </Router>
        </div>
      </AuthContext.Provider>
  )
}

export default App;

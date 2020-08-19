import React, {useContext, useEffect, useState} from "react";
import makeRequestToApi from "../libs/fetchFromApi";
import {AuthContext} from "../App";
import {navigate, redirectTo} from "@reach/router";
import firebaseApp from "../FirebaseConfig";

export function ProjectDetail({projectId}) {
  const [isAuthenticated, setIsAuthenticated, user, setUser] = useContext(AuthContext)
  const [project, setProject] = useState(null)
  const [issues, setIssues] = useState([]);
  const [viewIssueType, setViewIssueType] = useState("OPEN")

  function IssueCell({issueObj}) {
    if (!issueObj) return null
    return <div className="issue-cell" onClick={() => navigate()}>
      <div className="title">{issueObj.title}</div>
      <div className="subtitle">
        <span>#{issueObj.issueNumber}&nbsp;opened on {issueObj.createdOn}</span>
      </div>
    </div>
  }

  if (isAuthenticated === false) redirectTo('/')

  if (!project) {
    const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    firebaseApp.auth.onAuthStateChanged(a => {
      setIsAuthenticated(true)
      setUser(a)
      makeRequestToApi((development ? "http://localhost:8000" : "") + "/api/project", {_id: projectId}, user).then(async value => {
        if (value) {
          setProject(value.project)
          setIssues((await makeRequestToApi((development ? "http://localhost:8000" : "") + "/api/issue", {issueIds: value.project.issues})).issues)
        }
      })
    })
  }

  return project && isAuthenticated ? <div id="project-details">
    <div>
      <h3>{project.projectName}</h3>
      <h6>{project.projectCode}</h6>
    </div>

    <div id="issues-list-top">
      <input/>
      <span id="issues-switcher">
        <button style={{
          backgroundColor: viewIssueType === "OPEN" ? "#269ee2" : "#FFF",
          color: viewIssueType === "OPEN" ? "white" : "#474747"
        }} onClick={() => setViewIssueType("OPEN")}>OPEN</button>
        <button style={{
          backgroundColor: viewIssueType === "CLOSED" ? "#269ee2" : "#FFF",
          color: viewIssueType === "CLOSED" ? "white" : "#474747"
        }} onClick={() => setViewIssueType("CLOSED")}>CLOSED</button>
      </span>
      <button id="new-issue-button">NEW ISSUE</button>
    </div>
    <div id="issues-list">
      {issues.map(value => {
        return <IssueCell key={value._id} issueObj={value}/>
      })}
    </div>
  </div> : <div>Fetching project details...</div>
}
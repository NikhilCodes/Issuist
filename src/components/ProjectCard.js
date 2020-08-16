import React from "react"

export function CreateProjectCard() {
  return (<div className="project-card">
    <div style={{
      top: "10%",
      display: "inline-block",
      position: "relative",
      textAlign: "center",
      width: "100%"
    }}>+

      <div style={{
        fontSize: "20px"
      }}>
        New Project
      </div>
    </div>
  </div>)
}

function ProjectCard(props) {
  return (<div className="project-card">
    <h6>{props.project.projectName}</h6>
    <div style={{
      // WARNING: Changing components will cause align
      // mismatch with CreateProjectCard as well.
      fontSize: "20px"
    }}>{props.project.projectCode}
    </div>
  </div>)
}

export default ProjectCard
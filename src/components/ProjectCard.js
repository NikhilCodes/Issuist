import React from "react"

export function CreateProjectCard() {
  return (<div className="create-project-card">
    <div style={{
      top: "50%",
      left: "50%",
      textAlign: "center",
      overflow: "hidden",
      transform: "translate(-50%, -50%)",
      position: "relative"
    }}>+
      <div style={{
        fontSize: '18px'
      }}>Add Project</div>
    </div>
  </div>)
}

function ProjectCard() {
  return (<div className="project-card">

  </div>)
}

export default ProjectCard
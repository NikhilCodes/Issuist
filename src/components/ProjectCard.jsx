import React from "react"
import {navigate} from "@reach/router";

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

function ProjectCard({project}) {

  const onClickProject = () => {
    navigate(`/project/${project._id}`)
  }

  return (<div className="project-card" onClick={onClickProject}>
    <h6>{project.projectName}</h6>
    <div style={{
      // WARNING: Changing components will cause align
      // mismatch with CreateProjectCard as well.
      fontSize: "20px"
    }}>{project.projectCode}
    </div>
  </div>)
}

export default ProjectCard
const {UserToProjectsIdModel, ProjectModel, IssueModel} = require("../models/MongoModels")
UserToProjectsIdModel.createIndexes(
    {"_id": 1}
)

async function getUserByUidFromMongo(uid) {
  return await UserToProjectsIdModel.findById(uid)
}

async function getProjectsFromProjectIds(projectIds) {
  let projects = []
  for (let i = 0; i < projectIds.length; i++) {
    projects = [...projects, await ProjectModel.findById(projectIds[i]._id)]
  }

  return projects
}

async function getIssuesFromIssueIds(issueIds) {
  let issues = []
  for(let i=0;i<issueIds.length;i++) {
    issues = [...issues, await IssueModel.findById(issueIds[i])]
  }

  return issues
}

module.exports = {
  getUserByUidFromMongo,
  getProjectsFromProjectIds,
  getIssuesFromIssueIds
}
const {UserToProjectsIdModel, ProjectModel} = require("../models/MongoModels")
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

module.exports = {
  getUserByUidFromMongo,
  getProjectsFromProjectIds,
}
const admin = require("../FirebaseAdminApp")
const {UserToProjectsIdModel} = require("../models/MongoModels")

async function logOutUserByUid(uid) {
  await admin.auth.revokeRefreshTokens(uid)
}

async function updateSessionTokenForUserDocument(uid, newSessionToken) {
  await UserToProjectsIdModel.updateOne({_id: uid}, {sessionToken: newSessionToken})
}

module.exports = {
  logOutUserByUid,
  updateSessionTokenForUserDocument
}
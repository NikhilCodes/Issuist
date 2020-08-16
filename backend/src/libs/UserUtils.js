const admin = require("../FirebaseAdminApp")

async function logOutUserByUid(uid) {
  await admin.auth.revokeRefreshTokens(uid)
}

module.exports = {
  logOutUserByUid
}
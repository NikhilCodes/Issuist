const admin = require("firebase-admin")
const serviceAccount = require("../issuist-firebase-adminsdk-czmnq-55c268872a.json")
require("dotenv").config()

class FirebaseAdminApp {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE
    })
    this.auth = admin.auth()
  }
}

const firebaseAdminApp = new FirebaseAdminApp()

module.exports = firebaseAdminApp
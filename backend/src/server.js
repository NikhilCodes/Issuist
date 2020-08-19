const express = require("express")
const cors = require("cors")
const path = require("path")
const morgan = require("morgan")
const mongoose = require("mongoose")
const sslRedirect = require("heroku-ssl-redirect")
const cookieParser = require("cookie-parser")
const {verify} = require("jsonwebtoken")
const {decodeIdToken, sendSessionToken} = require("./libs/tokens")
const {logOutUserByUid} = require("./libs/UserUtils")
const {getProjectsFromProjectIds, getUserByUidFromMongo, getIssuesFromIssueIds} = require("./libs/getters")


require('dotenv').config()

const server = express()

mongoose.connect(
    "mongodb+srv://alpha-n1khil:shield3120@issuist.j1mpv.gcp.mongodb.net/IssuistDB?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    },
)

server.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
)
server.use(sslRedirect.default())
server.use(cookieParser())
server.use(morgan('common'))
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(express.static('frontend-build'))

server.use(decodeIdToken)

server.get("*", (req, res) => {
  console.log(path.resolve(__dirname, '../frontend-build'))
  res.sendFile("index.html", {
    root: path.resolve(__dirname, '../frontend-build')
  })
})

server.post('/api/login', async (req, res) => {
  try {
    await sendSessionToken(req, res)
    res.send({
      success: true
    })
  } catch (e) {
    console.log(e)
    res.send({
      success: false
    })
  }
})

server.post('/api/projects', (req, res) => {
  try {
    const sessionToken = req.cookies.sessionToken
    const {uid} = verify(sessionToken, process.env.SESSION_TOKEN_SECRET)

    if (!uid) {
      console.log("DIDNOT FIND UID")
      return res.send({
        status: "LOGIN_NEEDED"
      })
    }

    getUserByUidFromMongo(uid).then(async user => {

      if (!(user && sessionToken === user.sessionToken)) {
        if (uid) {
          // Making sure user is really getting logged out
          logOutUserByUid(uid).then()
        }
        console.log("USER OBJ", user)
        console.log("SESSION TOKEN", sessionToken)
        console.log(user.sessionToken)
        return res.send({
          status: "LOGIN_NEEDED"
        })
      }
      console.log("SERVER2", user.projects)
      res.send({
        status: "OK",
        projects: await getProjectsFromProjectIds(user.projects),
      })
    })
  } catch (e) {
    console.log(e)
    res.send({status: "FAIL", reason: e})
  }
})

server.post('/api/project', (req, res) => {
  try {
    const sessionToken = req.cookies.sessionToken
    const {uid} = verify(sessionToken, process.env.SESSION_TOKEN_SECRET)

    if (!uid) {
      console.log("DIDNOT FIND UID")
      return res.send({
        status: "LOGIN_NEEDED"
      })
    }

    getProjectsFromProjectIds([{_id: req.body._id}]).then(value => {
      console.log("IN2", value)
      return res.send({
        project: value[0]
      })
    })
  } catch (e) {
    console.log(e)
    res.send({status: "FAIL", reason: e})
  }
})

server.post('/api/issue', (req, res) => {
  try {
    const sessionToken = req.cookies.sessionToken
    const {uid} = verify(sessionToken, process.env.SESSION_TOKEN_SECRET)

    if (!uid) {
      console.log("DIDNOT FIND UID")
      return res.send({
        status: "LOGIN_NEEDED"
      })
    }

    getIssuesFromIssueIds(req.body.issueIds).then(value => {
      return res.send({
        issues: value
      })
    })
  } catch (e) {
    console.log(e)
    res.send({status: "FAIL", reason: e})
  }
})

server.listen(process.env.PORT, () => {
  console.log(`Server started at http://localhost:${process.env.PORT}`)
})

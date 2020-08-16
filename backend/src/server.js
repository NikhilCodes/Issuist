const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const {verify} = require("jsonwebtoken")
const {decodeIdToken, sendSessionToken} = require("./libs/tokens")
const {logOutUserByUid} = require("./libs/UserUtils")
const {getProjectsFromProjectIds, getUserByUidFromMongo} = require("./libs/getters")


require('dotenv').config()

const server = express()

mongoose.connect(
    "mongodb://127.0.0.1:27017/IssuistDB",
    {useUnifiedTopology: true, useNewUrlParser: true}
)

server.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
)
server.use(cookieParser())
server.use(morgan('common'))
server.use(express.json())
server.use(express.urlencoded({extended: true}))

server.use(decodeIdToken)

server.post('/', (req, res) => {
  res.send(req['currentUser'])
})

server.post('/login', (req, res) => {
  try {
    sendSessionToken(req, res)
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

server.post('/projects', (req, res) => {
  console.log(req.cookies.sessionToken)

  try {
    // const userDB = [{
    //   _id: "EhFcaqfDo7cLHGNaW6vA2kDT6Za2",
    //   sessionToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJFaEZjYXFmRG83Y0xIR05hVzZ2QTJrRFQ2WmEyIiwiaWF0IjoxNTk3NTc0MjUzLCJleHAiOjE1OTc2NjA2NTN9.tdGG-Z9xoCIzHVdvZEq-Gx-7XIE-tBZwUySq7pre-D0",
    //   projects: [{
    //     _id: "jh3ui4hr8wenr834",
    //   }, {
    //     _id: "yrth45t45t34tg52",
    //   }, {
    //     _id: "nvjir8nf745834tg",
    //   }]
    // }]
    // console.log(req.cookies)
    const sessionToken = req.cookies.sessionToken
    const {uid} = verify(sessionToken, process.env.SESSION_TOKEN_SECRET)

    if (!uid) {
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
        return res.send({
          status: "LOGIN_NEEDED"
        })
      }

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

server.listen(process.env.PORT, () => {
  console.log(`Server started at http://localhost:${process.env.PORT}`)
})

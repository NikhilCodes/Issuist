const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const server = express()

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

server.get('/', (req, res) => {
  res.send('Its working!')
})

server.listen(process.env.PORT, () => {
  console.log(`Server started at http://localhost:${process.env.PORT}`)
})

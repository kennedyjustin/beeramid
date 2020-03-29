const express = require("express")
const http = require("http")
const socketIo = require('socket.io')

let app = express()
let server = http.createServer(app)
let io = socketIo(server)

app.use(express.static('public'))

io.on('connection', (socket) => console.log(socket.id))

server.listen(3000,  () => console.log("Running Beeramid Server"))

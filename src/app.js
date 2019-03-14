import express from 'express'
import { Server } from 'http'
import { port } from './config'
import { initSocket } from './socket-handler'

const app = express()
app.use(express.static('public'))
const http = Server(app)
initSocket(http)

http.listen(port, () => {
    console.log('Noomnim Chat Server started at port ' + port)
})

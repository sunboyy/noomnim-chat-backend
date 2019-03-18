import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import { Server } from 'http'

import { port } from './config'
import { initSocket } from './socket-handler'
import route from './router'

const app = express()
app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(route)

const http = Server(app)
initSocket(http)

http.listen(port, () => {
    console.log('Noomnim Chat Server started at port ' + port)
})

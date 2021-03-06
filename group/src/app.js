import '@babel/polyfill'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import { Server } from 'http'
import morgan from 'morgan'

import { port } from './config'
import route from './router'

const app = express()
app.use(cors())

app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(route)

const http = Server(app)

http.listen(port, () => {
    console.log('Group member serive started at port ' + port)
})

process.on('SIGTERM', () => {
    http.close()
})

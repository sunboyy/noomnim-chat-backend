import { Router } from 'express'
import { findGroup } from './models/group'
import { checkMembership, getMembership } from './models/member'
import { insertMessage } from './models/message'
import { pushToGroup } from './socket-handler'
import { port } from './config'

const router = Router()

router.get('/', (req, res) => {
    res.send('Noomnim chat backend server running on port ' + port)
})

router.get('/group', async (req, res) => {
    try {
        const { keys } = req.query
        let group = await findGroup(keys)
        res.json({ status: 1, data: group })
    } catch (e) {
        res.json({ status: 0, error: e })
    }
})

router.get('/user/group', async (req, res) => {
    try {
        const { clientId } = req.query
        let groups = await getMembership(clientId)
        res.json({ status: 1, data: groups })
    } catch (e) {
        res.json({ status: 0, error: e })
    }
})

router.post('/message', async (req, res) => {
    try {
        const { content, clientId, groupId } = req.body
        if (!(await checkMembership(clientId, groupId))) {
            return res.json({ status: 0, error: 'Not a member of the group' })
        }
        const message = await insertMessage(content, clientId, groupId)
        res.json({ status: 1, data: message })
        pushToGroup(groupId, message)
    } catch (e) {
        res.json({ status: 0, error: e })
    }
})

export default router

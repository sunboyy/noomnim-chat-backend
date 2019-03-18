import { Router } from 'express'
import { getGroup, getAllGroup, insertGroup, leaveGroup } from './models/group'
import { checkMembership } from './models/member'
import { insertMessage } from './models/message'
import { pushToGroup } from './socket-handler'

const router = Router()

router.get('/group', async (req, res) => {
    try {
        let group = await getAllGroup()
        res.json({ status: 1, data: group })
    } catch (e) {
        res.json({ status: 0, error: e })
    }
})

router.post('/group', async (req, res) => {
    try {
        const { name } = req.body
        let group = await getGroup(name)
        if (group) {
            res.json({ status: 0, error: 'the group is already exist' })
        } else {
            group = await insertGroup(name)
            res.json({ status: 1, data: group })
        }
    } catch (e) {
        res.json({ status: 0, error: e })
    }
})

router.post('/message', async (req, res) => {
    try {
        const { content, clientId, groupId } = req.body
        if (!checkMembership(clientId, groupId)) {
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

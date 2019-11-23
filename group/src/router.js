// @ts-check
import { Router } from 'express'
import { getGroupMembers, findGroup } from './models/member'

const router = Router()

router.get('/members', async (req, res) => {
    try {
        const { groupId } = req.query
        let member = await getGroupMembers(groupId)
        res.json({ status: 1, data: member })
    }  catch (e) {
        res.json({ status: 0, error: e })
    }
})

router.get('/search', async (req, res) => {
    try {
        const { keys } = req.query
        let group = await findGroup(keys)
        res.json({ status: 1, data: group })
    } catch (e) {
        res.json({ status: 0, error: e })
    }
})

export default router

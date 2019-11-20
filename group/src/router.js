import { Router } from 'express'
import { getGroupMembers } from './models/member'

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

export default router

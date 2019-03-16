import { Router } from 'express'
import { getGroup, getAllGroup, insertGroup } from './models/group'

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

export default router
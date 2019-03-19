import { getConnection } from './database'
import { getClientById } from './client'

export function getMessage(id, join = []) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `message` WHERE `id` = ?', [id], async (err, rows) => {
            if (err) reject('Cannot get message')
            else if (rows.length == 0) resolve(null)
            else {
                const message = rows[0]
                if (join.includes('posted_by')) {
                    message.posted_by = await getClientById(message.posted_by)
                }
                resolve(message)
            }
            conn.release()
        })
    })
}

export function insertMessage(message, clientId, groupId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('INSERT INTO `message` (`content`, `posted_by`, `group_id`) VALUES (?, ?, ?)', [message, clientId, groupId], async (err, res) => {
            if (err) reject('Cannot insert message')
            else {
                resolve(await getMessage(res.insertId, ['posted_by']))
            }
            conn.release()
        })
    })
}

export function getUnreadMessage(groupId, lastMessgeId, join = []) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `message` WHERE `group_id` = ? AND `id` > ?', [groupId, lastMessgeId || 0], async (err, rows) => {
            if (err) reject(err)
            else {
                for (let i = 0; i < rows.length; i++) {
                    if (join.includes('posted_by')) {
                        rows[i].posted_by = await getClientById(rows[i].posted_by)
                    }
                }
                resolve(rows)
            }
            conn.release()
        })
    })
}

import { getConnection } from './database'

export function getMessage(id) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `message` WHERE `id` = ?', [id], (err, rows) => {
            if (err) reject('Cannot get message')
            else if (rows.length == 0) resolve(null)
            else resolve(rows[0])
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
                resolve(await getMessage(res.insertId))
            }
            conn.release()
        })
    })
}

export function getUnreadMessage(groupId, lastMessgeId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `message` WHERE `group_id` = ? AND `id` > ?', [groupId, lastMessgeId || 0], (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
            conn.release()
        })
    })
}

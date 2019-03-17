import { getConnection } from './database'

export function getAllGroup() {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `group`', (err, rows) => {
            if (err) reject('Cannot get group list')
            else resolve(rows)
            conn.release()
        })
    })
}

export function getGroup(name) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `group` WHERE `name` = ?', [name], (err, rows) => {
            if (err) reject('Cannot get group')
            else if (rows.length == 0) resolve(null)
            else resolve(rows[0])
            conn.release()
        })
    })
}

export function insertGroup(name) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('INSERT INTO `group` (`id`, `name`) VALUES (?, ?)', [0, name], (err, res) => {
            if (err) reject('Cannot insert group')
            else resolve({ id: res.insertId, name })
            conn.release()
        })
    })
}

export function leaveGroup(clientId, groupId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('DELETE FROM `member` WHERE `client_id` = ? AND `group_id` = ?', [clientId, groupId], (err, res) => {
            if (err) reject('Cannot leave group')
            else resolve(res.affectedRows)
            conn.release()
        })
    })
}
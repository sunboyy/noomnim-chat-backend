import { getConnection } from './database'

export function getGroupById(id) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `group` WHERE `id` = ?', [id], (err, rows) => {
            if (err) reject('Cannot get group')
            else if (rows.length == 0) resolve(null)
            else resolve(rows[0])
            conn.release()
        })
    })
}

import { getConnection } from './database'

export function getClient(name) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `client` WHERE `name` = ?', [name], (err, rows) => {
            if (err) reject('Cannot get client')
            else if (rows.length == 0) resolve(null)
            else resolve(rows[0])
            conn.release()
        })
    })
}

export function insertClient(name) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('INSERT INTO `client` (`id`, `name`) VALUES (?, ?)', [0, name], (err, res) => {
            if (err) reject('Cannot insert client')
            else resolve({ id: res.insertId, name })
            conn.release()
        })
    })
}

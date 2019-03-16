import { getConnection } from './database'

export function getMembership(clientId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT `group`.`id`, `group`.`name` FROM `member` NATURAL JOIN `group` WHERE `member`.`client_id` = ?', [clientId], (err, rows) => {
            if (err) reject('Cannot get membership')
            else resolve(rows)
            conn.release()
        })
    })
}

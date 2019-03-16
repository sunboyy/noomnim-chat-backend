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

export function checkMembership(clientId, groupId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `member` WHERE `client_id` = ? AND `group_id` = ?', [clientId, groupId], (err, rows) => {
            if (err) reject('Cannot check membership')
            else resolve(rows.length > 0)
            conn.release()
        })
    })
}

export function addMembership(clientId, groupId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        let hasGroup = false
        conn.query('SELECT * FROM `group` WHERE `id`=?', [groupId], (err, rows) => {
            if(err) reject('Error')
            else if(rows.length == 0) reject('Group does not exists!')
            else hasGroup = true
        })
        if(hasGroup) {
            conn.query('INSERT INTO `member` (`client_id`,`group_id`,`last_msg_id` VALUES (?,?,NULL)', [clientId, groupId], (err, res) => {
                if(err) reject('Cannot join group')
                // TODO: 
                else resolve({ })
            })
        }
        conn.release()
    })
}
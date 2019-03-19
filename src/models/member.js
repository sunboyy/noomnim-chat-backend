import { getConnection } from './database'

export function getMembership(clientId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query(
            'SELECT `group`.`id`, `group`.`name` FROM `member` INNER JOIN `group` ON `group`.`id` = `member`.`group_id` WHERE `member`.`client_id` = ?',
            [clientId],
            (err, rows) => {
                if (err) reject('Cannot get membership')
                else resolve(rows)
                conn.release()
            }
        )
    })
}

export function checkMembership(clientId, groupId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query(
            'SELECT * FROM `member` WHERE `client_id` = ? AND `group_id` = ?',
            [clientId, groupId],
            (err, rows) => {
                if (err) reject('Cannot check membership')
                else resolve(rows.length > 0)
                conn.release()
            }
        )
    })
}

export function addMembership(clientId, groupId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query(
            'INSERT INTO `member` (`client_id`,`group_id`,`last_msg_id` VALUES (?,?,NULL)',
            [clientId, groupId],
            (err, res) => {
                if (err) reject('Cannot join group')
                else resolve({ clientId, groupId })
                conn.release()
            }
        )
    })
}

export function getLastMessageId(clientId, groupId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query(
            'SELECT * FROM `member` WHERE `client_id` = ? AND `group_id` = ?',
            [clientId, groupId],
            async (err, rows) => {
                if (err) reject('Cannot get last message')
                else if (rows.length == 0) reject('Client not in the group')
                else resolve(rows[0].last_msg_id)
                conn.release()
            }
        )
    })
}

export function updateLastMessage(clientId, groupId, messageId) {
    return new Promise(async (resolve, reject) => {
        const lastMsgId = await getLastMessageId(clientId, groupId)
        if (lastMsgId !== null && lastMsgId >= messageId) return resolve()
        const conn = await getConnection()
        conn.query(
            'UPDATE `member` SET `last_msg_id` = ? WHERE `client_id` = ? AND `group_id` = ?',
            [messageId, clientId, groupId],
            (err, res) => {
                if (err) reject('Cannot update last message')
                else resolve()
                conn.release()
            }
        )
    })
}

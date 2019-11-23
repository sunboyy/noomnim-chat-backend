import { getConnection } from './database'

export function getGroupMembers(groupId) {
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query(
            'SELECT * FROM `client` \
            INNER JOIN `member`\
            ON `client`.`id` = `member`.`group_id` \
            WHERE `member`.`group_id` = ?',
            [groupId],
            (err, rows) => {
                if (err) reject('Cannot get group members')
                else resolve(rows)
                conn.release()
            }
        )
    })
}

export function findGroup(keys) {
    keys = keys.split(' ').map(key => '%' + key + '%')
    let qStr = '`name` LIKE ? OR '.repeat(keys.length)
    qStr = qStr.substr(0, qStr.length - 4)
    return new Promise(async (resolve, reject) => {
        const conn = await getConnection()
        conn.query('SELECT * FROM `group` WHERE ' + qStr, keys, (err, rows) => {
            if (err) reject('Cannot get group')
            else if (rows.length == 0) resolve(null)
            else resolve(rows)
            conn.release()
        })
    })
}

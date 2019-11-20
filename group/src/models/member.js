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

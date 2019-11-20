import mysql from 'mysql'
import { db } from '../config'

const pool = mysql.createPool(db)

export const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) return reject(err)
            resolve(conn)
        })
    })
}

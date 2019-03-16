import dotenv from 'dotenv'

dotenv.config()

export const port = process.env.HTTP_PORT || 3000
export const db = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'noomnim_chat'
}

import dotenv from 'dotenv'

dotenv.config()

export const port = process.env.HTTP_PORT || 3000

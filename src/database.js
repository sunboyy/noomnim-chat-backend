import mysql from 'mysql'
import { db } from './config'

export const pool = mysql.createPool(db)

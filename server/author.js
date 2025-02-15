import express from 'express'
import {Database} from './Database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const db = await Database()
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
        if(rows.length > 0) {
            return res.status(409).json({message : "user already existed"})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        await db.query("INSERT INTO users (username, email, password) VALUES ('', '', '')", 
            [username, email, hashPassword])
        
        return res.status(201).json({message: "user created successfully"})
    } catch(err) {
        return res.status(500).json(err.message)
    }
})

export default router
import express from 'express'
import cors from 'cors'
import author from './author.js'
import dotenv from 'dotenv';
dotenv.config();
const app = express()
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}))
app.use(express.json())
app.use('/auth', author) 
app.get('/', (req, res) => {
    console.log("req.body")
})

app.listen(process.env.PORT2, () => {
    console.log("Server is Running")
})
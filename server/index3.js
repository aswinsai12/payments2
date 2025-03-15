import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'payments'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

app.get('/payment', (req, res) => {
    const sql = 'SELECT id, user_id, payment_status, device_status FROM payments2';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Failed to fetch data' });
        } else {
            res.json(results);
        }
    });
});

app.post('/update', (req, res) => {
    const { id, device_status, payment_status } = req.body;

    const sql = 'UPDATE payments2 SET device_status = ?, payment_status = ? WHERE id = ?';
    db.query(sql, [device_status, payment_status, id], (err, results) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).json({ error: 'Failed to update data' });
        } else {
            const fetchSql = 'SELECT id, user_id, payment_status, device_status FROM payments2 WHERE id = ?';
            db.query(fetchSql, [id], (err, updatedRow) => {
                if (err) {
                    console.error('Error fetching updated data:', err);
                    res.status(500).json({ error: 'Failed to fetch updated data' });
                } else {
                    const thingSpeakUrl = `https://api.thingspeak.com/update?api_key=HDRHJ1DRIE8PQ8KR&field1=${device_status === 'online' ? 1 : 0}`;
                    axios(thingSpeakUrl)
                        .then(response => {
                            if (response.status !== 200) {
                                console.error('Failed to send signal to Arduino');
                            }
                            res.json(updatedRow[0]);
                        })
                        .catch(error => {
                            console.error('Failed to send signal to Arduino');
                            res.json(updatedRow[0]);
                        });
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
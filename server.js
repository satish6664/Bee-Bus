const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'agile123',
    database: 'christopher'
});

// Connect to database
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Route to get all buses
app.get('/api/buses', (req, res) => {
    let sql = 'SELECT * FROM buses';
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

// Route to get a single bus by ID
app.get('/api/buses/:bus_id', (req, res) => {
    let sql = `SELECT * FROM buses WHERE bus_id = ${req.params.bus_id}`;
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

// Route to update a bus
app.put('/api/buses/:bus_id', (req, res) => {
    let busId = req.params.bus_id;
    let updatedSeats = req.body.available_seats;
    let bookedSeats = req.body.booked_seats;
    let sql = `UPDATE buses SET available_seats = ? , booked_seats = ? WHERE bus_id = ?`;
    db.query(sql, [updatedSeats, bookedSeats, busId], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Bus updated' });
    });
});

// Route to delete a bus
app.delete('/api/buses/:bus_id', (req, res) => {
    let sql = `DELETE FROM buses WHERE bus_id = ${req.params.bus_id}`;
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Bus deleted' });
    });
});

// Route to add a new user
app.post('/api/passengers', (req, res) => {
    let newUser = req.body;
    let sql = 'INSERT INTO passengers SET ?';
    db.query(sql, newUser, (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Bus added', id: result.insertId });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

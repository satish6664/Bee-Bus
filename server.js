const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());

// Create database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('MySQL connected...');
});

// Routes

// Get all buses
app.get('/api/buses', (req, res) => {
  let sql = 'SELECT * FROM buses';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching buses:', err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Get a single bus by ID
app.get('/api/buses/:bus_id', (req, res) => {
  let sql = `SELECT * FROM buses WHERE bus_id = ${req.params.bus_id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching bus:', err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json(result);
  });
});

// Update a bus
app.put('/api/buses/:bus_id', (req, res) => {
  let busId = req.params.bus_id;
  let updatedSeats = req.body.available_seats;
  let bookedSeats = req.body.booked_seats;
  let sql = `UPDATE buses SET available_seats = ?, booked_seats = ? WHERE bus_id = ?`;
  db.query(sql, [updatedSeats, bookedSeats, busId], (err, result) => {
    if (err) {
      console.error('Error updating bus:', err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json({ message: 'Bus updated' });
  });
});

// Delete a bus
app.delete('/api/buses/:bus_id', (req, res) => {
  let sql = `DELETE FROM buses WHERE bus_id = ${req.params.bus_id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error deleting bus:', err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json({ message: 'Bus deleted' });
  });
});

// Add a new passenger
app.post('/api/passengers', (req, res) => {
  let newUser = req.body;
  let sql = 'INSERT INTO passengers SET ?';
  db.query(sql, newUser, (err, result) => {
    if (err) {
      console.error('Error adding passenger:', err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json({ message: 'Passenger added', id: result.insertId });
  });
});

// POST route to handle form submission
app.post('/addBus', (req, res) => {
  const {
      bus_name,
      from_location,
      to_location,
      departure_date,
      departure_time,
      arrival_time,
      bus_type,
      seat_capacity,
      available_seats,
      price
  } = req.body;
  const sql = `
  INSERT INTO buses (bus_name, from_location, to_location, departure_date, departure_time, arrival_time, bus_type, seat_capacity, available_seats, price)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    bus_name,
    from_location,
    to_location,
    departure_date,
    `${departure_date} ${departure_time}`,
    `${departure_date} ${arrival_time}`,
    bus_type,
    seat_capacity,
    available_seats,
    price
  ];
  
  console.log(values)
  db.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log('Bus added:', result);
      res.send('Bus added successfully!');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

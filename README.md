CREATE DATABASE christopher;
USE christopher;
CREATE TABLE buses (
    bus_id INT PRIMARY KEY AUTO_INCREMENT,
    bus_name VARCHAR(255) NOT NULL,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    bus_type VARCHAR(100),
    seat_capacity INT NOT NULL,
    available_seats INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
INSERT INTO buses (bus_name, from_location, to_location, departure_date, departure_time, arrival_time, bus_type, seat_capacity, available_seats, price)
VALUES 
('Express 101', 'New York', 'Boston', '2024-07-20' , '2024-07-20 08:00:00', '2024-07-20 12:00:00', 'AC', 50, 45, 25.00),
('City Liner', 'San Francisco', 'Los Angeles', '2024-07-21' , '2024-07-21 07:30:00', '2024-07-21 14:30:00', 'Sleeper', 40, 38, 50.00),
('Interstate', 'Chicago', 'Detroit', '2024-07-22' , '2024-07-22 09:00:00', '2024-07-22 13:00:00', 'Non-AC', 55, 50, 20.00),
('Night Rider', 'Houston', 'Dallas', '2024-07-23' , '2024-07-23 22:00:00', '2024-07-24 02:00:00', 'AC', 45, 42, 30.00),
('Morning Star', 'Miami', 'Orlando', '2024-07-24' , '2024-07-24 06:00:00', '2024-07-24 10:00:00', 'Non-AC', 60, 58, 15.00),
('Sunshine Express', 'Seattle', 'Portland', '2024-07-25' , '2024-07-25 10:00:00', '2024-07-25 13:00:00', 'AC', 50, 48, 18.00),
('Coastal Cruiser', 'San Diego', 'Las Vegas', '2024-07-26' , '2024-07-26 08:00:00', '2024-07-26 15:00:00', 'Sleeper', 35, 34, 55.00),
('Mountain Express', 'Denver', 'Salt Lake City', '2024-07-27' , '2024-07-27 07:00:00', '2024-07-27 13:00:00', 'Non-AC', 40, 39, 45.00),
('Lake Liner', 'Minneapolis', 'Milwaukee', '2024-07-28' , '2024-07-28 10:00:00', '2024-07-28 14:00:00', 'AC', 50, 50, 22.00),
('Desert Dash', 'Phoenix', 'Tucson', '2024-07-29' , '2024-07-29 11:00:00', '2024-07-29 14:00:00', 'Non-AC', 55, 53, 10.00);

INSERT INTO buses (bus_name, from_location, to_location, departure_date, departure_time, arrival_time, bus_type, seat_capacity, available_seats, price)
VALUES 
('Shatabdi Express', 'Mumbai', 'Pune', '2024-07-18', '2024-07-18 08:00', '2024-07-18 11:00', 'AC', 45, 40, 15.00),
('Rajdhani Express', 'Delhi', 'Chandigarh', '2024-07-18', '2024-07-18 07:30', '2024-07-18 11:30', 'Sleeper', 50, 48, 20.00),
('Garib Rath', 'Bangalore', 'Chennai', '2024-07-18', '2024-07-18 06:00', '2024-07-18 10:00', 'Non-AC', 55, 50, 10.00);
UPDATE buses
SET available_seats = 35
WHERE bus_id = '14';

ALTER TABLE buses
ADD COLUMN booked_seats VARCHAR(255) AFTER available_seats;
SET SQL_SAFE_UPDATES = 0;
SET SQL_SAFE_UPDATES = 1;
UPDATE buses
SET departure_date = DATE(departure_time);
UPDATE buses
SET available_seats = 45,
    booked_seats = ",U6"
WHERE bus_id = 1;

CREATE TABLE Passengers (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(15),
    gender VARCHAR(10)
);
INSERT INTO Passengers (first_name, last_name, email, phone_number, gender)
VALUES ('John', 'Doe', 'john.doe@example.com', '123-456-7890', 'Male');
CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT,
    bus_id INT,
    route_id INT,
    booking_date DATE NOT NULL,
    travel_date DATE NOT NULL,
    seat_number VARCHAR(10),
    booking_status VARCHAR(20) NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id),
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id),
    FOREIGN KEY (route_id) REFERENCES Routes(route_id)
);

SELECT * FROM buses;
SELECT * FROM passengers;
RENAME TABLE Passengers TO passengers;


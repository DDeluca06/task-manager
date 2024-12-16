const express = require('express')
const mysql = require('mysql2');
const app = express()

// Serve public files
app.use(express.static('public'));

// Serve static html
app.get('/index', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// MySQL Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
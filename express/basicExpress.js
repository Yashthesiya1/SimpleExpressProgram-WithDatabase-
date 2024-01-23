const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// Create a single variable to reference the SQLite database connection
const db = new sqlite3.Database('userdata.db');

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(bodyParser.urlencoded({ extended: true }));

// Set the path to the directory containing your HTML files
const publicPath = path.join(__dirname);

// Create the 'user' table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT
    )
`);

// Serve static files from the 'public' directory
app.use(express.static(publicPath));
app.use(express.json());
// Define a route for the '/demo.html' URL
app.get('/demo.html', (req, res) => {
    // Use 'res.sendFile' to send the HTML file
    res.sendFile(path.join(publicPath, 'demo.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, email, password } = req.body;
    db.run('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, password], function (err) {
        if (err) {
            console.error('Error in database', err);
            res.status(500).send('Server error');
        } else {
            console.log('Form data added to the database. Row ID:', this.lastID);
            res.send(`Form submitted successfully. Name: ${name}, Email: ${email}, Password: ${password} 
            
            `);
        }
    });

    db.all('SELECT *FROM user', [], (err, row) => {
        if (err) {
            throw err;
        }
        console.log('All USER DATA');

        // const dis = document.getElementById('display');
        row.forEach(rows => {
            // dis.innerHTML += `${rows.name},
            // ${rows.email},
            // ${rows.paasowrd}`
            console.log(`${rows.name}-${rows.email}-${rows.password}`);
        });

    });
});

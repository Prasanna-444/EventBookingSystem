const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3002;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', 
  database: 'user_auth'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(__dirname + '/public/forgot-password.html');
});

app.get('/event', (req, res) => {
    res.sendFile(__dirname + '/public/event.html');
  });


app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err,results) => {
    if (err) throw err;
    res.redirect('/login');


  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
        res.redirect('/event');
      
     
    } else {
      res.send('Invalid email or password');
    }
  });
});


app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  res.send('Password reset link sent to ' + email);
}); 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

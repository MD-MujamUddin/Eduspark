const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const db = require('./db'); // Ensure this has insertUser() and validateUser()

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Register route
app.post('/register', async (req, res) => {
  console.log('Registration data received:', req.body);
  const { fullname, email, phone, birthdate, gender, username, password } = req.body;

  // Validate the input
  if (!fullname || !email || !phone || !birthdate || !gender || !username || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    await db.insertUser({ fullname, email, phone, birthdate, gender, username, password });
    res.status(200).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('User registered successfully', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const isValid = await db.validateUser(username, password);
    if (isValid) {
      req.session.user = username;
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Premium content route
app.get('/premium', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, content: 'This is premium course content.' });
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
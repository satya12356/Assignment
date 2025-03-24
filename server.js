const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const secretKey = 'yourSecretKey'; // Replace with a strong secret key

// Dummy user data (replace with a database in a real application)
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Dashboard API (protected)
app.get('/api/dashboard', verifyToken, (req, res) => {
  const dashboardData = [
    { id: 1, title: 'Card 1' },
    { id: 2, title: 'Card 2' },
    { id: 3, title: 'Card 3' },
  ];
  res.json(dashboardData);
});

// Map View API (protected)
app.get('/api/map', verifyToken, (req, res) => {
  const mapData = {
    center: [20.5937, 78.9629], // Center of India
    zoom: 5,
  };
  res.json(mapData);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
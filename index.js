const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const infographicRoutes = require('./routes/infographicRoutes');
const dotenv = require('dotenv');   
const cors = require('cors');
const Admin = require('./models/admin');  
dotenv.config();
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://infographics-admin.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
  // Handle preflight requests
  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://infographics-admin.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.send();
  });

app.use(bodyParser.json({ limit: '5mb' }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/infographics', infographicRoutes);

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log(err));

app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`);
});
app.post('/admin', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ username });

    // Check if admin exists and password is correct
    if (!admin || !admin.isValidPassword(password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = admin.generateAuthToken();

    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
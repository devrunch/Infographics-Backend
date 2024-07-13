const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const infographicRoutes = require('./routes/infographicRoutes');
const dotenv = require('dotenv');   
const cors = require('cors');
dotenv.config();
const app = express();
app.use(cors(
    {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
    }
));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
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

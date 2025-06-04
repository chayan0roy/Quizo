const express = require('express');
const app = express();
const dotenv = require('dotenv');



const db = require('./config/db');

dotenv.config();


app.get('/', (req, res) => {
    res.send('Hello Developers');
});


    
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
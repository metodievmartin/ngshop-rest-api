const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


// Set ENV variables from config.env
dotenv.config({ path: './config.env' });

const app = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

const DB = process.env.DB_CONNECTION;
const options = {
  dbName: process.env.DB_NAME
};
mongoose.connect(
  DB,
  options,
  (err) => {
    if (err) {
      console.log('DB connection error - ', err);
    } else {
      console.log('DB connected...');
    }
  }
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server's running on http://localhost:${port}`);
});
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const productsRouter = require('./routers/productsRouter');
const categoriesRouter = require('./routers/categoriesRouter');
const ordersRouter = require('./routers/ordersRouter');
const usersRouter = require('./routers/usersRouter');


// Set ENV variables from config.env
dotenv.config({ path: './config.env' });

const app = express();

// -- GLOBAL MIDDLEWARES --

// CORS policy
app.use(cors());

// Body parser - parsing data from body into req.body
app.use(express.json());

// Development request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// -- DB --

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

// -- ROUTES --

const api = process.env.API_URL;

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

// -- SERVER --

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server's running on http://localhost:${port}`);
});
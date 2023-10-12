const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1.MiddleWares
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'devlopment') {
  console.log('hello from morgan........................');
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  console.log('hello from middleware 🦹‍♂️');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
////

////Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/user', userRouter);

module.exports = app;

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const ApppError=require('./utils/appError')
const globalErrorHandler=require('./controllers/errorController')
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
app.all('*',(req,res,next)=>{
  // const err=new Error (`Can't find ${req.originalUrl} on this server`)
  // err.status='fail'
  // err.statusCode=404
  // console.log(err,'err')
  next(new ApppError(`Can't find ${req.originalUrl} on this server`,404))

})
app.use(globalErrorHandler)


module.exports = app;

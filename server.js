const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connection successfull');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
  },
  rating: {
    type: Number,
    default: 4.7,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const tourTest = new Tour({
  name: 'Sayed MOhd zaf',
  rating: 4.9,
  //   price: 1300,
});
tourTest
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Error', err);
  });
const port = process.env.Port || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}... `);
});

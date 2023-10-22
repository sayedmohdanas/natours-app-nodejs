const Tour = require('./../models/tourModel');
const ApiFeatures=require('../utils/apiFeatures')

////data arrray ///////

//comment bcz data saving in data base////
// const tour = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );
//middleWare for checking body and sending next()
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'fail', message: 'Misssing name or price' });
//   }
//   next();
// };
//middleware for top tours

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next();
};

//class for Api features

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query, 'first call');
    //1A  filtering
    // const queryObj = { ...req.query };
    // // const queryObj = req.query;
    // console.log(queryObj, 'for checking queryObj 1');

    // const excludedFields = ['sort', 'page', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // //1B Advance Filtering
    // let queryStr = JSON.stringify(queryObj);
    // console.log(queryStr, 'for checking queryStr 1');

    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/, (match) => `$${match}`);
    // // const query = Tour.find(req.query);
    // // const query = Tour.find(queryObj);

    // let query = Tour.find(JSON.parse(queryStr));

    //sort
    // if (req.query.sort) {
    //   console.log(req.query.sort);
    //   const sortBy = req.query.sort.split(',').join(' ');

    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-_v');
    // }

    //pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);
    ////if numerber of pages greater than your data then use this function
    // if (req.query.page) {
    //   const numTour = await Tour.countDocuments();
    //   console.log(req.query.page, 'skip', skip);
    //   if (skip >= numTour) throw new Error('this paghe does not exist');
    // }
    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .limitField()
      .paginate()
      .sort();
    const tour = await features.query;
    res.status(200).json({
      status: 'success',
      result: tour.length,
      data: {
        tour,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

////Post Request Example for creating new obbject in array ////
exports.createTour = async (req, res) => {
  console.log(req.body);
  // const newTour = new Tour ({})
  // newTour.save() ////1st way for saving data

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent from User',
      error: error,
    });
  }

  // const newId = tour[tour.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tour.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tour),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   },
  // );
};

///respondig parameters params and respond particular id data /////
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      tour,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
  // const tours = tour.find((el) => el.id === id);
  // res.status(200).json({ ststus: 'success', tours });
};

///using patch api method for updating perticular object data/////
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ status: 'success', tour, message: 'Tour updated successfully' });
  } catch (error) {
    res
      .status(404)
      .json({ status: 'error', error, message: 'Internal server error' });
  }

  // const updatedTourIndex = tour.findIndex((tours) => tours.id === id);
  // if (updatedTourIndex !== -1) {
  //   tour[updatedTourIndex] = {
  //     ...tour[updatedTourIndex],
  //     ...req.body,
  //   };
  //   return res
  //     .status(200)
  //     .json({ status: 'success', message: 'Tour updated successfully' });
  // } else {
  //   return res
  //     .status(500)
  //     .json({ status: 'error', message: 'Internal server error' });
  // }
};

///////using delete method for delete something in  the data ////

exports.deletetour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    // tour.filter((tours) => tours.id !== id);
    res.status(404).json({ status: 'fail', error: error });
  }
};

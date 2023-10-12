const fs = require('fs');

////data arrray ///////
const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkTourID = (req, res, next, val) => {
  const { id } = req.params.id;
  if (id > tour.length - 1) {
    return res.status(404).json({ status: 'invalid', message: 'invalid id' });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Misssing name or price' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tour.length,
    data: {
      tour,
    },
  });
};

////Post Request Example for creating new obbject in array ////
exports.createTour = (req, res) => {
  const newId = tour[tour.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tour.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tour),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

///respondig parameters params and respond particular id data /////
exports.getTour = (req, res) => {
  const id = req.params.id * 1;

  const tours = tour.find((el) => el.id === id);
  res.status(200).json({ ststus: 'success', tours });
};

///using patch api method for updating perticular object data/////
exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  const updatedTourIndex = tour.findIndex((tours) => tours.id === id);
  if (updatedTourIndex !== -1) {
    tour[updatedTourIndex] = {
      ...tour[updatedTourIndex],
      ...req.body,
    };
    return res
      .status(200)
      .json({ status: 'success', message: 'Tour updated successfully' });
  } else {
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  }
};

///////using delete method for delete something in  the data ////

exports.deletetour = (req, res) => {
  const id = req.params.id * 1;
  tour.filter((tours) => tours.id !== id);
  res.status(204).json({ status: 'success', message: 'deleted' });
};

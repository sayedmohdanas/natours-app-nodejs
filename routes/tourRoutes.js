const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = express.Router();

router.param('id', tourController.checkTourID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .patch(tourController.updateTour)
  .get(tourController.getTour)
  .delete(tourController.deletetour);

module.exports = router;

/////set route for updting tour no 1 //////////
// app.get('/api/v1/tours', getallUsers);
// app.get('/api/v1/tours/:id',getTour)
// app.post('/api/v1/tours',createTour)
// app.patch('/api/v1/tours/:id', updateTour);
////////////////////////////////////////////////////

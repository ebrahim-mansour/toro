const express = require('express');

const multer = require('multer');
const upload = multer({ dest: 'public/uploads/images/' });

const traineeProfileRouter = express.Router();

function router() {

  let traineeProfileController = require('../controllers/traineeProfileController');

  function ensureAuthenticated(req, res, next) {
    if (req.user) {
      let trainee = req.user.traineeId;
      if (req.isAuthenticated()) {
        if (trainee) {
          return next();
        } else {
          res.redirect('/coachProfile');
        }
      }
    } else {
      // req.flash('error_msg','You are not logged in');
      res.redirect('/users/login');
    }
  }

  traineeProfileRouter.route('/settings')
    .get(ensureAuthenticated, traineeProfileController.gets.settings)
    .post(ensureAuthenticated, traineeProfileController.posts.settings)

  traineeProfileRouter.route('/')
    .get(ensureAuthenticated, traineeProfileController.gets.getDaysWorkoutsOrCompleteRegistration)

  traineeProfileRouter.route('/completeRegistration')
    .post(ensureAuthenticated, upload.single('pic'), traineeProfileController.posts.completeRegistration)

  traineeProfileRouter.route('/getCoaches')
    .get(ensureAuthenticated, traineeProfileController.gets.getCoaches)

  traineeProfileRouter.route('/getWorkout')
    .post(ensureAuthenticated, traineeProfileController.posts.getWorkout)

  traineeProfileRouter.route('/getRestDay')
    .post(ensureAuthenticated, traineeProfileController.posts.getRestDay)

  traineeProfileRouter.route('/startNow')
    .post(ensureAuthenticated, traineeProfileController.posts.startNow)

  traineeProfileRouter.route('/getNextDayIfExists')
    .post(ensureAuthenticated, traineeProfileController.posts.getNextDayIfExists)

  traineeProfileRouter.route('/timeSlots')
    .get(ensureAuthenticated, traineeProfileController.gets.getTimeSlots)

  traineeProfileRouter.route('/timeSlots/getTimeSlotsOfSpecificDay')
    .post(ensureAuthenticated, traineeProfileController.posts.getTimeSlotsOfSpecificDay)

  traineeProfileRouter.route('/timeSlots/requestSession')
    .post(ensureAuthenticated, traineeProfileController.posts.requestSession)

  return traineeProfileRouter;

}

module.exports = router();
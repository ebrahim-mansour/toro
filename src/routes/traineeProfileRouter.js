const express = require('express');

const traineeProfileRouter = express.Router();

function router() {

  let traineeProfileController = require('../controllers/traineeProfileController');

  function ensureAuthenticated(req, res, next) {
    if (req.user) {
      let trainee = req.user.traineeId;
      if (req.isAuthenticated()) {
        if (trainee) {
          return next();
        } else if (req.user.role == 0) {
          res.redirect('/admin')
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

  // All days if user has already completed registration
  traineeProfileRouter.route('/')
    .get(ensureAuthenticated, traineeProfileController.gets.getDaysWorkoutsOrCompleteRegistration)

  // Complete registration
  traineeProfileRouter.route('/completeRegistration')
    .post(ensureAuthenticated, traineeProfileController.posts.completeRegistration)

  // Get coaches to choose from
  traineeProfileRouter.route('/getCoaches')
    .get(ensureAuthenticated, traineeProfileController.gets.getCoaches)

  // Day details
  traineeProfileRouter.route('/workout/:dayNumber')
    .get(ensureAuthenticated, traineeProfileController.gets.dayDetails)

  // If trainee wants to start before the starting date
  traineeProfileRouter.route('/startNow')
    .post(ensureAuthenticated, traineeProfileController.posts.startNow)

  // When finishing the current day
  traineeProfileRouter.route('/getNextDayIfExists')
    .post(ensureAuthenticated, traineeProfileController.posts.getNextDayIfExists)

  // All coach available time slots
  traineeProfileRouter.route('/timeSlots')
    .get(ensureAuthenticated, traineeProfileController.gets.getTimeSlots)
  
  // Coach available time slots in a specfic day
  traineeProfileRouter.route('/timeSlots/getTimeSlotsOfSpecificDay')
    .post(ensureAuthenticated, traineeProfileController.posts.getTimeSlotsOfSpecificDay)

  // Ask Coaches Questions
  traineeProfileRouter.route('/askQuestion')
    .get(ensureAuthenticated, traineeProfileController.gets.askQuestion)

  // To request a private session in a certain day
  traineeProfileRouter.route('/timeSlots/requestSession')
    .post(ensureAuthenticated, traineeProfileController.posts.requestSession)

  return traineeProfileRouter;

}

module.exports = router();
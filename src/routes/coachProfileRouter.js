const express = require('express');

const multer = require('multer');
const upload = multer({ dest: 'public/uploads/videos/' });

const coachProfileRouter = express.Router();

function router() {

  let coachProfileController = require('../controllers/coachProfileController');

  function ensureAuthenticated(req, res, next) {
    if (req.user) {
      let coach = req.user.proficiency;
      if (req.isAuthenticated()) {
        if (coach) {
          return next();
        } else {
          res.redirect('/traineeProfile');
        }
      }
    } else {
      // req.flash('error_msg','You are not logged in');
      res.redirect('/users/login');
    }
  }

  // Home page
  coachProfileRouter.route('/')
    .get(ensureAuthenticated, coachProfileController.gets.manageTrainees)

  // Manage trainee
  coachProfileRouter.route('/manageTrainee/:traineeId')
    .get(ensureAuthenticated, coachProfileController.gets.manageTrainee)

  coachProfileRouter.route('/editDay/:traineeId/:dayNumber')
    .get(ensureAuthenticated, coachProfileController.gets.editDay)
    .post(ensureAuthenticated, coachProfileController.posts.editDay)

  // Chat Questions
  coachProfileRouter.route('/chatQuestions')
    .get(ensureAuthenticated, coachProfileController.gets.chatQuestions)

  // Trainee chat room
  coachProfileRouter.route('/chatQuestions/:roomId')
    .get(ensureAuthenticated, coachProfileController.gets.chatRoom)

  coachProfileRouter.route('/deleteDay')
    .post(ensureAuthenticated, coachProfileController.posts.deleteDay)

  coachProfileRouter.route('/resetDays')
    .post(ensureAuthenticated, coachProfileController.posts.resetDays)

  // Workouts */
  coachProfileRouter.route('/workouts')
    .get(ensureAuthenticated, coachProfileController.gets.workouts)

  coachProfileRouter.route('/workouts/getWorkout')
    .get(ensureAuthenticated, coachProfileController.gets.getWorkout)

  coachProfileRouter.route('/workouts/new')
    .get(ensureAuthenticated, coachProfileController.gets.newWorkout)
    .post(ensureAuthenticated, coachProfileController.posts.createWorkout)

  coachProfileRouter.route('/deleteWorkout')
    .post(ensureAuthenticated, coachProfileController.posts.deleteWorkout)

  // Rest Day
  coachProfileRouter.route('/restDays')
    .get(ensureAuthenticated, coachProfileController.gets.restDays)

  coachProfileRouter.route('/restDays/getRestDay')
    .get(ensureAuthenticated, coachProfileController.gets.getRestDay)

  coachProfileRouter.route('/restDays/new')
    .get(ensureAuthenticated, coachProfileController.gets.newRestDay)
    .post(ensureAuthenticated, upload.single('videoForRestDay'), coachProfileController.posts.createRestDay)

  // Returning data according to workout or rest day
  coachProfileRouter.route('/workoutsOrRestDays')
    .get(ensureAuthenticated, coachProfileController.gets.workoutsOrRestDays)

  // Week Plans
  coachProfileRouter.route('/weekPlans')
    .get(ensureAuthenticated, coachProfileController.gets.weeksPlans)

  // Getting week plans
  coachProfileRouter.route('/weekPlans/getWeekPlan')
    .get(ensureAuthenticated, coachProfileController.gets.getWeekPlan)

  // Creating week plan
  coachProfileRouter.route('/weekPlans/new')
    .get(ensureAuthenticated, coachProfileController.gets.newWeekPlan)
    .post(ensureAuthenticated, coachProfileController.posts.createWeekPlan)

  // Get exercises of each muscle
  coachProfileRouter.route('/exercisesByCategory')
    .get(ensureAuthenticated, coachProfileController.gets.exercisesByCategory)

  // Add Day
  coachProfileRouter.route('/addDay')
    .post(ensureAuthenticated, coachProfileController.posts.addDay)

  // Add Rest Day
  coachProfileRouter.route('/addRestDay')
    .post(ensureAuthenticated, coachProfileController.posts.addRestDay)

  // Add Week
  coachProfileRouter.route('/addWeek')
    .post(ensureAuthenticated, coachProfileController.posts.addWeek)

  // Get and add timeslots
  coachProfileRouter.route('/timeSlots')
    .get(ensureAuthenticated, coachProfileController.gets.getTimeSlots)
    .post(ensureAuthenticated, coachProfileController.posts.addTimeSlot)

  // Delete timeslot
  coachProfileRouter.route('/timeSlots/removeTimeSlot')
    .post(ensureAuthenticated, coachProfileController.posts.removeTimeSlot)

  // Add gym to a timeslot
  coachProfileRouter.route('/timeSlots/addGymName')
    .post(ensureAuthenticated, coachProfileController.posts.addGymName)

  // Manage private sessions
  coachProfileRouter.route('/managePrivateSessions')
    .get(ensureAuthenticated, coachProfileController.gets.managePrivateSessions)

  // Change profile setting
  coachProfileRouter.route('/settings')
    .get(ensureAuthenticated, coachProfileController.gets.settings)
    .post(ensureAuthenticated, coachProfileController.posts.settings)

  return coachProfileRouter;

}

module.exports = router();
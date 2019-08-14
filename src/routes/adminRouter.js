const express = require('express')
const multer = require('multer');

const upload = multer({
  dest: 'public/uploads/exercises/'
})

const adminRouter = express.Router()

function router() {

  function ensureAuthenticated(req, res, next) {
    if (req.user) {
      let role = req.user.role
      if (req.isAuthenticated()) {
        switch (role) {
          case 0:
            next()
            break
          case 1:
            res.redirect('/coachProfile')
          case 2:
            res.redirect('/traineeProfile')
        }
      }
    } else {
      // req.flash('error_msg','You are not logged in')
      res.redirect('/users/login')
    }
  }

  let adminController = require('../controllers/adminController')

  // Home page
  adminRouter.route('/')
    .get(ensureAuthenticated, adminController.gets.dashboard)

  // Manage coaches page
  adminRouter.route('/coaches')
    .get(ensureAuthenticated, adminController.gets.manageCoaches)

  // Delete coach
  adminRouter.route('/coaches/delete/:id')
    .get(ensureAuthenticated, adminController.deletes.deleteCoach)

  // Accept coache
  adminRouter.route('/coaches/accept/:id')
    .get(ensureAuthenticated, adminController.patches.acceptCoach)

  // Manage exercises
  adminRouter.route('/exercises')
    .get(ensureAuthenticated, adminController.gets.exercises)

  // Add exercise
  adminRouter.route('/exercises/add')
    .get(ensureAuthenticated, adminController.gets.addExercise)
    .post(ensureAuthenticated, upload.single('image'), adminController.posts.addExercise)

  // View exercises by category
  adminRouter.route('/exercises/:category')
    .get(ensureAuthenticated, adminController.gets.viewExercisesByCategory)

  // Edit exercises
  adminRouter.route('/exercises/edit/:exerciseName')
    .get(ensureAuthenticated, adminController.gets.editExercise)
    .post(ensureAuthenticated, upload.single('image'), adminController.patches.editExercise)

  adminRouter.route('/exercises/delete/:exerciseName')
    .post(ensureAuthenticated, adminController.deletes.deleteExercise)

    return adminRouter
}

module.exports = router()
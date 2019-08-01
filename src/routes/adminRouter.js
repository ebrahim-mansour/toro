const express = require('express')

const adminRouter = express.Router()

function router() {

  let adminController = require('../controllers/adminController');

  function ensureAuthenticated(req, res, next) {
    if (req.user) {
      let role = req.user.role;
      if (req.isAuthenticated()) {
        switch (role) {
          case 0:
            next()
            break
          case 1:
            res.redirect('/coachProfile');
          case 2:
            res.redirect('/traineeProfile');
        }
      }
    } else {
      // req.flash('error_msg','You are not logged in');
      res.redirect('/users/login');
    }
  }

  // Home page
  adminRouter.route('/')
    .get(ensureAuthenticated, adminController.gets.dashboard)

  return adminRouter;

}

module.exports = router();
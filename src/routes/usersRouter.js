const express = require('express');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users');
const Login = require('../models/login');
const Coach = require('../../src/models/coache');
const Trainee = require('../../src/models/trainee');

User.hasMany(Trainee, { foreignKey: 'traineeId' })
Trainee.belongsTo(User, { foreignKey: 'traineeId' })

User.hasMany(Coach, { foreignKey: 'coachId' })
Coach.belongsTo(User, { foreignKey: 'coachId' })

const usersRouter = express.Router();

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  (email, password, done) => {
    Login.findOne({
      where: { email: email }
    })
      .then(user => {
        if (!user) {
          return done(null, false);
        } else {
          Login.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        }
      })
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  if (user.role == 0) {
    const admin =  {
      role: 0
    }
    done(null, admin)
  } else if (user.role == 1) {
    const coach = await Coach.findOne({
      where: {
        coachId: user.id
      },
      include: {
        model: User,
        required: true
      }
    })
    done(null, coach);
  } else {
    const trainee = await Trainee.findOne({
      where: {
        traineeId: user.id
      },
      include: {
        model: User,
        required: true
      }
    })
    done(null, trainee);
  }
});

function router() {

  let usersController = require('../controllers/usersController');

  // Return sign up for coaches
  usersRouter.route('/coaches/signup')
    .get(usersController.gets.coachSignup)
    .post(usersController.posts.coachSignup)

  // Return sign up for trainees
  usersRouter.route('/trainees/signup')
    .get(usersController.gets.traineeSignup)
    .post(usersController.posts.traineeSignup)

  // Return log in
  usersRouter.route('/login')
    .get(usersController.gets.login)
    .post(
      passport.authenticate('local', { failureRedirect: '/users/login' }),
      usersController.posts.login
    )

  return usersRouter;

}

module.exports = router();
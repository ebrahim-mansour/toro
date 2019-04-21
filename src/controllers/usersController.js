const User = require('../models/users');
const Login = require('../models/login');
const Trainee = require('../models/trainee');
const Coach = require('../models/coache');

let get = {
  coachSignup: (req, res) => {
    if (req.user) {
      let role = req.user.role;
      if (req.isAuthenticated()) {
        if (role == 1) {
          res.redirect('/coachProfile');
        } else {
          res.redirect('/traineeProfile');
        }
      }
    } else {
      return res.render('coaches/signup');
    }
  },
  traineeSignup: (req, res) => {
    let user = req.user;
    if (user !== undefined) {
      let role = req.user.role;
      if (req.isAuthenticated()) {
        if (role == 1) {
          res.redirect('/coachProfile');
        } else {
          res.redirect('/traineeProfile');
        }
      }
    } else {
      return res.render('trainees/signup');
    }
  },
  login: (req, res) => {
    if (req.user) {
      let role = req.user.role;
      if (req.isAuthenticated()) {
        if (role == 1) {
          res.redirect('/coachProfile');
        } else {
          res.redirect('/traineeProfile');
        }
      }
    } else {
      // console.log(req.flash());
      return res.render('login', { success_msg: req.flash('success_msg') });
    }
  }
}
let post = {
  coachSignup: async (req, res) => {

    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let username = firstName + ' ' + lastName;
    let password = req.body.password;
    let email = req.body.email;
    let phone = req.body.mobile;
    let proficiency = req.body.proficiency;

    // Validation
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm_password', 'Passwords do not match').equals(password);
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('mobile', 'Mobile is not valid').isMobilePhone("ar-EG");
    req.checkBody('proficiency', 'Proficiency is required').notEmpty();

    let phoneAlreadyExist = await User.phoneAlreadyExist(phone);
    let emailAlreadyExist = await Login.emailAlreadyExist(email);
    let errors = req.validationErrors();

    if (errors || phoneAlreadyExist || emailAlreadyExist) {
      return res.render('coaches/signup', {
        errors: errors,
        phoneAlreadyExist: phoneAlreadyExist,
        emailAlreadyExist: emailAlreadyExist,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        proficiency: proficiency
      });
    } else {
      let id;
      let maxId = await User.getMaxId();
      if (maxId) {
        id = maxId + 1;
      } else {
        id = 1;
      }
      let newUser = new User({
        id: id,
        firstName: firstName,
        lastName: lastName,
        userName: username,
        phone: phone
      });
      let newCoach = new Coach({
        coachId: id,
        proficiency: proficiency
      });
      let newLogin = new Login({
        id: id,
        email: email,
        password: password,
        role: 1
      });
      User.createUser(newUser);
      Coach.createUser(newCoach);
      Login.createUser(newLogin)
      // req.flash('success_msg', 'Signed up Successfully');
      return res.redirect('/users/login');
    }
  },
  traineeSignup: async (req, res) => {

    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let username = firstName + ' ' + lastName;
    let password = req.body.password;
    let email = req.body.email;
    let phone = req.body.mobile;

    // Validation
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm_password', 'Passwords do not match').equals(password);
    req.checkBody('email', 'Email is required').notEmpty();
    if (email) {
      req.checkBody('email', 'Email is not valid').isEmail();
    }
    req.checkBody('mobile', 'Mobile is required').notEmpty();
    if (phone) {
      req.checkBody('mobile', 'Mobile is not valid').isMobilePhone("ar-EG");
    }

    let phoneAlreadyExist = await User.phoneAlreadyExist(phone);
    let emailAlreadyExist = await Login.emailAlreadyExist(email);
    let errors = req.validationErrors();

    if (errors || phoneAlreadyExist || emailAlreadyExist) {
      return res.render('trainees/signup', {
        errors: errors,
        phoneAlreadyExist: phoneAlreadyExist,
        emailAlreadyExist: emailAlreadyExist,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
      });
    } else {
      let id;
      let maxId = await User.getMaxId();
      if (maxId) {
        id = maxId + 1;
      } else {
        id = 1;
      }
      let newUser = new User({
        id: id,
        firstName: firstName,
        lastName: lastName,
        userName: username,
        phone: phone
      });
      let newTrainee = new Trainee({
        traineeId: id
      });
      let newLogin = new Login({
        id: id,
        email: email,
        password: password,
        role: 2
      });
      User.createUser(newUser);
      Trainee.createUser(newTrainee);
      Login.createUser(newLogin)
      // req.flash('success_msg', 'Signed up Successfully');
      return res.redirect('/users/login');
    }
  },
  login: (req, res) => {
    let role = req.user.role;
    if (role == 1) {
      return res.redirect('/coachProfile')
    } else {
      return res.redirect('/traineeProfile');
    }
  }
}
let usersController = {
  gets: get,
  posts: post
}
module.exports = usersController;
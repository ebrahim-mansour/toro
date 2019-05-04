const bcrypt = require('bcrypt');

const Coach = require('../models/coache');
const User = require('../models/users');
const Login = require('../models/login');
const Trainee = require('../models/trainee');
const Day = require('../models/days');
const Workout = require('../models/workouts');
const WorkoutsExercises = require('../models/workoutsExercises');
const Gyms = require('../models/gyms');
const RestDay = require('../models/restDays');
const WeeksPlans = require('../models/weeksPlans');
const TimeSlots = require('../models/timeSlots');
const DayHours = require('../models/reservedHours');

let get = {
  settings: async (req, res) => {
    let traineeId = req.user.traineeId;
    let proficiency = req.user.program;
    let coaches = await Coach.getCoachesByProficiencies(proficiency);
    let trainee = await Login.getLoginData(traineeId);
    return res.render('trainees/settings', {
      coaches: coaches,
      trainee: trainee
    });
  },
  getDaysWorkoutsOrCompleteRegistration: async (req, res) => {

    // Get the current date
    let nowDate = new Date();
    let day = nowDate.getDate();
    let nextDay = nowDate.getDate() + 1;
    let month = nowDate.getMonth() + 1; //January is 0!
    let year = nowDate.getFullYear();
    if (day < 10 || nextDay < 10) {
      day = '0' + day;
      nextDay = '0' + nextDay;
    }
    if (month < 10) {
      month = '0' + month
    }
    nowDate = year + '-' + month + '-' + day;

    /*
    // Get tomorrow date
    let tomorrow = year + '-' + month + '-' + nextDay;
    */

    let program = req.user.program;
    if (program) {
      let traineeId = req.user.traineeId;
      /*let coachId = req.user.coachId;*/

      // Get the starting date of the trianee
      let startingDate = req.user.startingDate;
      if (startingDate > nowDate) {
        return res.render('trainees/beforeStartingDate');
      } else {
        let days = await Day.getDaysWorkoutsAndRestDays(traineeId);
        // let workouts = await Workout.getCoachWorkouts(coachId);
        // let restDays = await RestDay.getRestDays(coachId);
        // let weeksPlans = await WeeksPlans.getWeeksPlans(coachId);
        return res.render('trainees/traineeHomePage', {
          days,
          // workouts,
          // restDays,
          // weeksPlans,
          nowDate,
          // tomorrow
        });
      }
    } else {
      return res.render('trainees/completeRegistration');
    }
  },
  getCoaches: async (req, res) => {
    let proficiency = req.query.proficiency;
    let coaches = await Coach.getCoachesByProficiencies(proficiency);
    return res.render('trainees/getCoaches', { coaches: coaches });
  },
  dayDetails: async (req, res) => {
    // Get the current date
    let nowDate = new Date();
    let day = nowDate.getDate();
    let nextDay = nowDate.getDate() + 1;
    let month = nowDate.getMonth() + 1; //January is 0!
    let year = nowDate.getFullYear();
    if (day < 10 || nextDay < 10) {
      day = '0' + day;
      nextDay = '0' + nextDay;
    }
    if (month < 10) {
      month = '0' + month
    }
    nowDate = year + '-' + month + '-' + day;

    let traineeId = req.user.traineeId;
    let dayNumber = req.params.dayNumber;

    let traineeAvailableDays = await Day.getAllTraineeAvailableDays(traineeId, nowDate);
    let isDayAvailable = traineeAvailableDays.find((day) => day.dayNumber == dayNumber);

    if (isDayAvailable) {
      let days = await Day.getDaysWorkoutsAndRestDays(traineeId);
      let dayDetails = await Day.getDay(traineeId, dayNumber);

      // Check if the day is workout or restday
      let isDayWorkout = dayDetails.workoutId;
      if (isDayWorkout) {
        let workoutId = dayDetails.workoutId;
        let exercises = await WorkoutsExercises.getExercises(workoutId);
        return res.render('trainees/dayDetails', { days, dayDetails, exercises, dayNumber, nowDate });
      }

      let restDayId = dayDetails.restDayId;
      let restDay = await RestDay.getRestDay(restDayId);
      return res.render('trainees/dayDetails', { days, dayDetails, restDay, dayNumber, nowDate });
    }
    return res.redirect('back');


  },
  getTimeSlots: async (req, res) => {

    // Get the current date
    let nowDate = new Date();
    let day = nowDate.getDate();
    let month = nowDate.getMonth() + 1; //January is 0!
    let year = nowDate.getFullYear();
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month
    }
    nowDate = year + '-' + month + '-' + day;

    let coachId = req.user.coachId;
    let startingDate = req.user.startingDate;
    if (startingDate && startingDate <= nowDate) {
      let timeSlots = await TimeSlots.getAvailableTimeSlotsOfCoach(coachId);
      let gyms = await Gyms.getAllGyms();
      return res.render("trainees/availableTimeSlots", { timeSlots: timeSlots, gyms: gyms });
    } else {
      return res.redirect('/traineeProfile');
    }
  }
}
let post = {
  settings: async (req, res) => {
    let traineeId = req.user.traineeId;
    let proficiency = req.user.program;

    let loginData = await Login.getLoginData(traineeId);
    let oldHash = loginData.password;

    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let userName = firstName + " " + lastName;

    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword

    let email = req.body.email;
    let phone = req.body.phone;
    let coachId = req.body.coachId;

    // Validation
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();

    req.checkBody('email', 'Email is required').notEmpty();
    if (email) {
      req.checkBody('email', 'Email is not valid').isEmail();
    }
    req.checkBody('phone', 'Phone is required').notEmpty();
    if (phone) {
      req.checkBody('phone', 'Phone is not valid').isMobilePhone("ar-EG");
    }
    req.checkBody('coachId', 'Coach is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
      let coaches = await Coach.getCoachesByProficiencies(proficiency)
      let trainee = await Login.getLoginData(traineeId);
      return res.render('trainees/settings', {
        coaches: coaches,
        trainee: trainee,
        errors: errors,
      });
    } else {
      if (oldPassword) {
        let isMatch = await Trainee.comparePassword(oldPassword, oldHash)
        if (isMatch) {
          req.checkBody('cNewPassword', 'Passwords do not match').equals(newPassword);
          req.checkBody('newPassword', 'New password is required').notEmpty();
          let errors = req.validationErrors();
          if (errors) {
            let coaches = await Coach.getCoachesByProficiencies(proficiency);
            return res.render('trainees/settings', {
              coaches,
              coachId,
              errors,
            });
          } else {
            User.updateSettings(firstName, lastName, userName, phone, traineeId);
            // Removing the old workouts when changing the trainer
            let traineeCurrentCoachId = await Trainee.getTraineeInfo(traineeId);
            if (coachId != traineeCurrentCoachId[0].coachId) {
              Trainee.updateSettings(coachId, traineeId);
              Trainee.changeStatus(traineeId, "new");
              Day.removeTraineeDays(traineeId);
            }

            let salt = await bcrypt.genSalt(10);
            let newHash = await bcrypt.hash(newPassword, salt);
            Login.updateSettings(email, newHash, traineeId);
            return res.redirect('/traineeProfile');
          }
        } else {
          let passwordError = 'Your Password is not correct'
          let coaches = await Coach.getCoachesByProficiencies(proficiency);
          return res.render('trainees/settings', {
            coaches,
            coachId,
            passwordError,
          });
        }
      } else {
        User.updateSettings(firstName, lastName, userName, phone, traineeId);
        // Removing the old workouts when changing the trainer
        let traineeCurrentCoachId = await Trainee.getTraineeInfo(traineeId);
        if (coachId != traineeCurrentCoachId[0].coachId) {
          Trainee.updateSettings(coachId, traineeId);
          Trainee.changeStatus(traineeId, "new");
          Day.removeTraineeDays(traineeId);
        }
        return res.redirect('/traineeProfile');
      }
    }
  },
  completeRegistration: async (req, res) => {
    // let coaches = await Coach.getAllCoaches();
    let traineeId = req.user.traineeId;
    let status = 'new';

    let program = req.body.program;
    let coachId = req.body.coachId;
    let startingDate = req.body.startingDate;
    let weight = req.body.weight;
    let height = req.body.height;
    let age = req.body.age;
    let experience = req.body.experience;

    req.checkBody('program', 'Program is required').notEmpty();
    req.checkBody('coachId', 'Coach is required').notEmpty();
    req.checkBody('startingDate', 'Date is required').notEmpty();
    if (startingDate) {
      req.checkBody('startingDate', 'Date should not be equal or before today').isAfter();
    }
    req.checkBody('weight', 'Weight is required').notEmpty();
    req.checkBody('height', 'Height is required').notEmpty();
    req.checkBody('age', 'Age is required').notEmpty();
    req.checkBody('experience', 'Experience is required').notEmpty();
    // req.checkBody('price', 'Price is required').notEmpty();

    let errors = req.validationErrors();
    /*
    let picerror = [];
    try {
      let picPath = req.file.path;
    } catch (err) {
      picerror.push({ param: 'pic', msg: 'Picture is required', value: '' });
    }
    In the condition below ==> || !(picerror.length == 0)
    */
    if (errors) {
      return res.render('trainees/completeRegistration', {
        errors,
        // coaches: coaches,
        coachId,
        program,
        startingDate,
        weight,
        height,
        age,
        experience,
        // picerror: picerror
      });
    } else {
      // picturePath = req.file.path
      // newPicPath = picturePath.slice(7);
      Trainee.addInfo(traineeId, status, program, coachId, startingDate, weight, height, age, experience/*, newPicPath*/);

      return res.redirect('/traineeProfile');
    }
  },
  startNow: async (req, res) => {

    // Get the current date
    let nowDate = new Date();
    let day = nowDate.getDate();
    let month = nowDate.getMonth() + 1; //January is 0!
    let year = nowDate.getFullYear();
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month
    }
    nowDate = year + '-' + month + '-' + day;

    let traineeId = req.user.traineeId;
    await Trainee.startNow(traineeId, nowDate);
    return res.redirect('/traineeProfile');
  },
  getNextDayIfExists: async (req, res) => {

    // Get the current date
    let nowDate = new Date();
    let dayNow = nowDate.getDate();
    let nextDayDate = nowDate.getDate() + 1;
    let month = nowDate.getMonth() + 1; //January is 0!
    let year = nowDate.getFullYear();
    if (dayNow < 10 || nextDayDate < 10) {
      dayNow = '0' + dayNow;
      nextDayDate = '0' + nextDayDate;
    }
    if (month < 10) {
      month = '0' + month
    }
    nowDate = year + '-' + month + '-' + dayNow;

    let dayNumber = req.body.dayNumber;
    let traineeId = req.user.traineeId;
    // Editing the current day status and the next one if it exists
    let day = await Day.getDay(traineeId, dayNumber);
    // In case the current day has a private session, it will be (done and has a private session)
    if (day) {
      if (day.status == 'current and has a private session') {
        let status = "done and has a private session";
        Day.updateDayStatusAndDate(status, nowDate, traineeId, dayNumber);
        /* In case the current day does not has a private session, it will be (done) */
      } else {
        let status = "done";
        Day.updateDayStatusAndDate(status, nowDate, traineeId, dayNumber);
      }
      // Handling the next day status and start date
      let nextDayNumber = parseInt(dayNumber) + 1;
      let nextDay = await Day.getDay(traineeId, nextDayNumber);
      if (nextDay != null) {
        let status = "current";
        Day.updateDayStatusAndDate(status, nowDate, traineeId, nextDayNumber);
      }
      // Changing the trainee status according to his last day status
      let maxDayNumber = await Day.getMaxDay(traineeId);
      let lastDay = await Day.getDay(traineeId, maxDayNumber);
      if (lastDay.status == "done" || lastDay.status == "done and has a private session") {
        Trainee.changeStatus(traineeId, "pending...");
      }
    }
    return res.redirect('/traineeProfile');
  },
  /*
  getWorkout: async (req, res) => {
    let workoutId = req.body.workoutId;
    let exercises = await WorkoutsExercises.getExercises(workoutId);
    return res.render('trainees/workout', { exercises });
  },
  getRestDay: async (req, res) => {
    let restDayId = req.body.restDayId;
    let restDay = await RestDay.getRestDay(restDayId);
    return res.render('trainees/restDay', { restDay: restDay });
  },
  */
  getTimeSlotsOfSpecificDay: async (req, res) => {

    // Get the current date
    let nowDate = new Date();
    let day = nowDate.getDate();
    let month = nowDate.getMonth() + 1; //January is 0!
    let year = nowDate.getFullYear();
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month
    }
    nowDate = year + '-' + month + '-' + day;

    let coachId = req.user.coachId;
    let dayNumber = req.body.dayNumber;

    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date(nowDate);
    let dayName = days[d.getDay()];

    let timeSlots = await Gyms.getTimeSlotsOfSpecificDay(dayName, coachId);
    return res.render("trainees/chooseHour", { timeSlots, dayNumber });
  },
  requestSession: async (req, res) => {

    // Get the current date
    let nowDate = new Date();
    let day = nowDate.getDate();
    let month = nowDate.getMonth() + 1; //January is 0!
    let year = nowDate.getFullYear();
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month
    }
    nowDate = year + '-' + month + '-' + day;

    let dayNumber = req.body.dayNumber;
    let hour = req.body.dayHour;
    let dayName = req.body.dayName;

    let traineeId = req.user.traineeId;
    let coachId = req.user.coachId;
    TimeSlots.updateHourStatus(dayName, hour, coachId);
    let newHour = new DayHours({
      dayName,
      hour,
      coachId,
      traineeId,
      reservationDate: nowDate
    })
    DayHours.addReservedHours(newHour);
    let status = "current and has a private session";
    Day.updateDayStatus(status, traineeId, dayNumber);
    return res.redirect('/traineeProfile');
  }
}
let trineeProfileController = {
  gets: get,
  posts: post
}
module.exports = trineeProfileController;
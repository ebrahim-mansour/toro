const bcrypt = require('bcrypt');

// Models Needed
const User = require('../models/users');
const Login = require('../models/login');
const Trainee = require('../models/trainee');
const Coach = require('../models/coache');
const Day = require('../models/days');
const Exercises = require('../models/exercises');
const Workout = require('../models/workouts');
const WorkoutsExercises = require('../models/workoutsExercises');
const TimeSlots = require('../models/timeSlots');
const DayHours = require('../models/reservedHours');
const Gyms = require('../models/gyms');
const RestDay = require('../models/restDays');
const WeeksPlans = require('../models/weeksPlans');
const WeeksPlansDetails = require('../models/weeksPlansDetails');

/*
// Get the current date
let nowDate = new Date();
let dd = nowDate.getDate();
let mm = nowDate.getMonth() + 1; //January is 0!
let yyyy = nowDate.getFullYear();
if (dd < 10) {
  dd = '0' + dd
}
if (mm < 10) {
  mm = '0' + mm
}
nowDate = yyyy + '-' + mm + '-' + dd;
*/

let get = {
  settings: async (req, res) => {
    let coachId = req.user.coachId;
    let coach = await Login.getLoginData(coachId);
    return res.render('coaches/settings', { coach: coach });
  },
  manageUsers: async (req, res) => {
    let coachId = req.user.coachId;
    let trainees = await Trainee.getTraineesOfSpecificCoach(coachId);
    return res.render('coaches/coachHomePage', { trainees: trainees });
  },
  workouts: async (req, res) => {
    let coachId = req.user.coachId;
    let workouts = await Workout.getCoachWorkouts(coachId)
    return res.render('coaches/workouts/workouts', { workouts: workouts });
  },
  getWorkout: async (req, res) => {
    let workoutId = req.query.workoutId;
    let exercises = await WorkoutsExercises.getExercises(workoutId);
    return res.render('coaches/workouts/workout', { exercises, workoutId });
  },
  newWorkout: async (req, res) => {
    let exercises = await Exercises.getDistinctNamesOfCategories();
    return res.render('coaches/workouts/new', { exercises: exercises });
  },
  exercisesByCategory: async (req, res) => {
    let category = req.query.category;
    let exercises = await Exercises.getCategoryExercises(category)
    return res.render('coaches/exercises/exercisesByCategory', { exercises: exercises });
  },
  restDays: async (req, res) => {
    let coachId = req.user.coachId;
    let restDays = await RestDay.getRestDays(coachId);
    return res.render('coaches/restDays/restDays', { restDays: restDays });
  },
  getRestDay: async (req, res) => {
    let restDayId = req.query.restDayId;
    let restDay = await RestDay.getRestDay(restDayId);
    return res.render('coaches/restDays/restDay', { restDay: restDay });
  },
  newRestDay: (req, res) => {
    return res.render('coaches/restDays/new');
  },
  workoutsOrRestDays: async (req, res) => {
    let coachId = req.user.coachId;
    let workoutsOrRestDays = req.query.value;
    switch (workoutsOrRestDays) {
      case "1":
        let workouts = await Workout.getCoachWorkouts(coachId);
        return res.render('coaches/weeksPlans/workoutsOrRestDays', { workouts: workouts });
      // break;
      case "2":
        let restDays = await RestDay.getRestDays(coachId);
        return res.render('coaches/weeksPlans/workoutsOrRestDays', { restDays: restDays });
      // break;
    }
  },
  weeksPlans: async (req, res) => {
    let coachId = req.user.coachId;
    let weeksPlans = await WeeksPlans.getWeeksPlans(coachId);
    return res.render('coaches/weeksPlans/weeks', { weeksPlans: weeksPlans });
  },
  getWeekPlan: async (req, res) => {
    let weekPlanId = req.query.weekPlanId;
    let weekPlanDetails = await WeeksPlansDetails.getWeekPlanById(weekPlanId);
    let workouts = [];
    let restDays = [];
    for (let i = 0; i < weekPlanDetails.length; i++) {
      workoutId = weekPlanDetails[i].workoutId;
      restDayId = weekPlanDetails[i].restDayId;
      if (workoutId != null) {
        let workout = await Workout.getWorkout(workoutId);
        workouts.push(workout);
      } else {
        let restDay = await RestDay.getRestDay(restDayId);
        restDays.push(restDay);
      }
    }
    return res.render('coaches/weeksPlans/week', { weekPlanDetails: weekPlanDetails, workouts: workouts, restDays: restDays });
  },
  newWeekPlan: (req, res) => {
    return res.render('coaches/weeksPlans/new');
  },
  getTimeSlots: async (req, res) => {
    let coachId = req.user.coachId;
    let timeSlots = await TimeSlots.getTimeSlots(coachId);
    let timeSlotsWithGyms = await Gyms.getTimeSlotsWithGyms(coachId);
    let gyms = await Gyms.getAllGyms();
    return res.render("coaches/coachTimeSlots", { timeSlots: timeSlots, timeSlotsWithGyms: timeSlotsWithGyms, gyms: gyms });
  },
  managePrivateSessions: async (req, res) => {
    let coachId = req.user.coachId;
    let daysHours = await DayHours.getDaysHours(coachId);
    return res.render("coaches/privateSessions", { daysHours: daysHours });
  }
}
let post = {
  settings: async (req, res) => {

    let coachId = req.user.coachId;

    let loginData = await Login.getLoginData(coachId);
    let oldHash = loginData.password;

    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let userName = firstName + " " + lastName;

    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword

    let proficiency = req.body.proficiency;

    let email = req.body.email;
    let phone = req.body.phone;

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
    req.checkBody('proficiency', 'Proficiency is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
      let coach = await Login.getLoginData(coachId);
      return res.render('coaches/settings', {
        coach: coach,
        errors: errors
      });
    } else {
      if (oldPassword) {
        let isMatch = await Coach.comparePassword(oldPassword, oldHash)
        if (isMatch) {
          req.checkBody('cNewPassword', 'Passwords do not match').equals(newPassword);
          req.checkBody('newPassword', 'New password is required').notEmpty();
          let errors = req.validationErrors();
          if (errors) {
            let coach = await Login.getLoginData(coachId)
            return res.render('coaches/settings', {
              coach: coach,
              errors: errors
            });
          } else {
            User.updateSettings(firstName, lastName, userName, phone, coachId);
            Coach.updateSettings(proficiency, coachId);
            let salt = await bcrypt.genSalt(10);
            let newHash = await bcrypt.hash(newPassword, salt)
            Login.updateSettings(email, newHash, coachId);
            return res.redirect('/coachProfile');
          }
        } else {
          let coach = await Login.getLoginData(coachId);
          let passwordError = 'Your Password is not correct'
          return res.render('coaches/settings', {
            coach: coach,
            errors: errors,
            passwordError: passwordError
          });
        }
      } else {
        User.updateSettings(firstName, lastName, userName, phone, coachId);
        Coach.updateSettings(proficiency, coachId);
        return res.redirect('/coachProfile');
      }
    }
  },
  manageUser: async (req, res) => {
    let coachId = req.user.coachId;
    let traineeId = req.body.traineeId;

    let days = await Day.getDaysWorkoutsAndRestDays(traineeId);
    let workouts = await Workout.getCoachWorkouts(coachId);
    let restDays = await RestDay.getRestDays(coachId);
    let weeksPlans = await WeeksPlans.getWeeksPlans(coachId);

    return res.render('coaches/manageUser', {
      days,
      workouts,
      restDays,
      weeksPlans,
      traineeId
    });

  },
  deleteDay: async (req, res) => {
    let dayNumber = req.body.dayNumber;
    let traineeId = req.body.traineeId;

    let coachId = req.user.coachId;
    let trainees = await Trainee.getTraineesOfSpecificCoach(coachId);

    // Validate trainee
    let validateTrainee = trainees.find(trainee => {
      return trainee.traineeId == traineeId
    });
    
    if (validateTrainee) {
      Day.deleteDay(traineeId, dayNumber);
    }

    return res.redirect('/coachProfile');

  },
  addDay: async (req, res) => {

    // Get the current date
    let nowDate = new Date();
    let dd = nowDate.getDate();
    let mm = nowDate.getMonth() + 1; //January is 0!
    let yyyy = nowDate.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    nowDate = yyyy + '-' + mm + '-' + dd;
        
    let workoutId = req.body.workoutId;
    let traineeId = req.body.traineeId;

    let days = await Day.getAllTraineeDays(traineeId);
    
    let maxDay = await Day.getMaxDay(traineeId);
    let dayNumber = maxDay ? maxDay + 1 : 1;

    let newDay = new Day({
      workoutId,
      traineeId,
      dayNumber,
      dayDate: nowDate
    });
    /* 1- if the first day */
    let firstDay = days.length < 1;
    if (firstDay) {
      newDay.whenToStart = nowDate;
      newDay.status = "current";
    } else {
      /*
        2- if the last day status = "done" 
        3- if the last day status = "done and has a private session"
          then (next day status = "current")
      */
      let isLastDayDone = days[days.length - 1].status == "done";
      let isLastDayDoneAndHasSession = days[days.length - 1].status == "done and has a private session";
      if (isLastDayDone || isLastDayDoneAndHasSession) {
        newDay.whenToStart = nowDate;
        newDay.status = "current";
      }
      /*
        4- if the last day status = "available"
        5- if the last day status = "current"
        6- if the last day status = "available and has a private session"
        7- if the last day status = "current and has a private session"
           then (day status = "available")
      */
      let isLastDayAvailable = days[days.length - 1].status == "available";
      let isLastDayCurrent = days[days.length - 1].status == "current";
      let isLastDayAvailableAndHasSession = days[days.length - 1].status == "available and has a private session";
      let isLastDayCurrentAndHasSession = days[days.length - 1].status == "current and has a private session";
      if (isLastDayAvailable || isLastDayCurrent || isLastDayAvailableAndHasSession || isLastDayCurrentAndHasSession) {
        newDay.status = "available";
      }
    }
    Day.createDay(newDay);
    Trainee.changeStatus(traineeId, 'done');
    return res.redirect('/coachProfile');
  },
  addRestDay: async (req, res) => {

    // Get the current date
    let nowDate = new Date();
    let dd = nowDate.getDate();
    let mm = nowDate.getMonth() + 1; //January is 0!
    let yyyy = nowDate.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    nowDate = yyyy + '-' + mm + '-' + dd;
    
    let restDayId = req.body.restDayId;
    let traineeId = req.body.traineeId;

    let days = await Day.getAllTraineeDays(traineeId);
    
    let maxDay = await Day.getMaxDay(traineeId);
    let dayNumber = maxDay ? maxDay + 1 : 1;

    let newDay = new Day({
      dayNumber,
      dayDate: nowDate,
      traineeId,
      restDayId
    });
    /* 1- if the first day */
    let firstDay = days.length < 1;
    if (firstDay) {
      newDay.whenToStart = nowDate;
      newDay.status = "current";
    } else {
      /*
        2- if the last day status = "done" 
        3- if the last day status = "done and has a private session"
          then (next day status = "current")
      */
      let isLastDayDone = days[days.length - 1].status == "done";
      let isLastDayDoneAndHasSession = days[days.length - 1].status == "done and has a private session";
      if (isLastDayDone || isLastDayDoneAndHasSession) {
        newDay.whenToStart = nowDate;
        newDay.status = "current";
      }
      /*
        4- if the last day status = "available"
        5- if the last day status = "current"
        6- if the last day status = "available and has a private session"
        7- if the last day status = "current and has a private session"
           then (day status = "available")
      */
      let isLastDayAvailable = days[days.length - 1].status == "available";
      let isLastDayCurrent = days[days.length - 1].status == "current";
      let isLastDayAvailableAndHasSession = days[days.length - 1].status == "available and has a private session";
      let isLastDayCurrentAndHasSession = days[days.length - 1].status == "current and has a private session";
      if (isLastDayAvailable || isLastDayCurrent || isLastDayAvailableAndHasSession || isLastDayCurrentAndHasSession) {
        newDay.status = "available";
      }
    }
    Day.createDay(newDay);
    Trainee.changeStatus(traineeId, 'done');
    return res.redirect('/coachProfile');
  },
  addWeek: async (req, res) => {

    // Get the current date
    let nowDate = new Date();
    let dd = nowDate.getDate();
    let mm = nowDate.getMonth() + 1; //January is 0!
    let yyyy = nowDate.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    nowDate = yyyy + '-' + mm + '-' + dd;
    
    let weekPlanId = req.body.weekPlanId;
    let traineeId = req.body.traineeId;

    let days = await Day.getAllTraineeDays(traineeId);
    
    let maxDay = await Day.getMaxDay(traineeId);
    let dayNumber = maxDay ? maxDay + 1 : 1;

    let weekPlanDetails = await WeeksPlansDetails.getWeekPlanById(weekPlanId);
    let firstDayStatus;
    let whenToStart;

    /* 1- if the first day */
    let firstDay = days.length < 1;
    if (firstDay) {
      firstDayStatus = "current";
      whenToStart = nowDate;
    } else {
      /*
        2- if the last day status = "done" 
        3- if the last day status = "done and has a private session"
          then (next day status = "current")
      */
      let isLastDayDone = days[days.length - 1].status == "done";
      let isLastDayDoneAndHasSession = days[days.length - 1].status == "done and has a private session";
      if (isLastDayDone || isLastDayDoneAndHasSession) {
        whenToStart = nowDate;
        firstDayStatus = "current";
      }
      /*
        4- if the last day status = "available"
        5- if the last day status = "current"
        6- if the last day status = "available and has a private session"
        7- if the last day status = "current and has a private session"
          then (day status = "available")
      */
      let isLastDayAvailable = days[days.length - 1].status == "available";
      let isLastDayCurrent = days[days.length - 1].status == "current";
      let isLastDayAvailableAndHasSession = days[days.length - 1].status == "available and has a private session";
      let isLastDayCurrentAndHasSession = days[days.length - 1].status == "current and has a private session";
      if (isLastDayAvailable || isLastDayCurrent || isLastDayAvailableAndHasSession || isLastDayCurrentAndHasSession) {
        firstDayStatus = "available";
      }
    }
    for (let i = 0; i < weekPlanDetails.length; i++) {
      let newDay = new Day();
      newDay.dayNumber = dayNumber;
      newDay.dayDate = nowDate;
      newDay.whenToStart = whenToStart;
      newDay.status = firstDayStatus;
      newDay.traineeId = traineeId;
      if (weekPlanDetails[i].workoutId != null) {
        let workoutId = weekPlanDetails[i].workoutId;
        newDay.workoutId = workoutId;
      } else {
        let restDayId = weekPlanDetails[i].restDayId;
        newDay.restDayId = restDayId;
      }
      dayNumber++;
      firstDayStatus = "available";
      whenToStart = null;
      Day.createDay(newDay);
    }
    Trainee.changeStatus(traineeId, 'done');
    return res.redirect('/coachProfile');
  },
  createWorkout: async (req, res) => {
    let coachId = req.user.coachId;
    let workoutName = req.body.workoutName;
    let exercisesNames = req.body.exercise;
    let sets = req.body.sets;
    let reps = req.body.reps;
    
    req.checkBody('workoutName', 'Workout name is required').notEmpty();
    req.checkBody('sets', 'All sets numbers are required').notEmpty();
    req.checkBody('reps', 'All reps numbers are required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
      let exercises = await Exercises.getDistinctNamesOfCategories();
      return res.render('coaches/workouts/new', { exercises, errors });
    } else {
      let workoutMaxId = await Workout.getMaxWorkoutId();
      let workoutId;
      // Checking if it's the first workout or not
      workoutMaxId ? workoutId = workoutMaxId + 1 : workoutId = 1;

      // Creating new workout structure
      let newWorkout = new Workout({
        workoutId,
        workoutName,
        coachId
      });
      // Saving the workout according to the number of exercises
      Workout.createWorkout(newWorkout);
      if (typeof (exercisesNames) == "object") {
        for (let i = 0; i < exercisesNames.length; i++) {
          let newExercise = new WorkoutsExercises({
            exerciseName: exercisesNames[i],
            sets: sets[i],
            reps: reps[i],
            workoutId,
            coachId
          });
          WorkoutsExercises.addExercise(newExercise)
        }
      } else {
        let newExercise = new WorkoutsExercises({
          exercisesNames,
          sets,
          reps,
          workoutId,
          coachId
        });
        WorkoutsExercises.addExercise(newExercise)
      }
      return res.redirect('/coachProfile/workouts');
    }
  },
  deleteWorkout: (req, res) => {
    let workoutId = req.body.workoutId;
    Workout.deleteWorkout(workoutId);
    return res.redirect('/coachProfile/workouts');
  },
  createRestDay: async (req, res) => {
    let coachId = req.user.coachId;

    let restDay = await RestDay.getRestDays(coachId);
    let restDayId = restDay.length + 1;

    let restDayName = req.body.restDayName;
    let whatToDo = req.body.whatToDo;
    let videoPath;
    let newVideoPath;
    if (req.file) {
      videoPath = req.file.path;
      newVideoPath = videoPath.slice(6);
    }

    req.checkBody('restDayName', 'Rest Day Name is required').notEmpty();
    req.checkBody('whatToDo', 'What To Do is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
      return res.render('coaches/restDays/new', { errors: errors });
    } else {
      let newRestDay = new RestDay({
        restDayId,
        name: restDayName,
        whatToDo,
        video: newVideoPath,
        coachId
      });
      RestDay.createRestDay(newRestDay, () => {
        return res.redirect('/coachProfile/restdays');
      })
    }
  },
  createWeekPlan: async (req, res) => {
    let coachId = req.user.coachId;

    let dayNumber;
    let maxDayNumber = await WeeksPlansDetails.max('dayNumber');
    if (maxDayNumber) {
      dayNumber = maxDayNumber + 1;
    } else {
      dayNumber = 1;
    }

    let weekPlanName = req.body.weekPlanName;
    let chooseActivity = req.body.chooseActivity;
    let values = req.body.workoutsOrRestDays;

    req.checkBody('weekPlanName', 'Week Plan name is required').notEmpty();

    let errors = req.validationErrors();
    let chooseActivityError = [];

    for (let i = 0; i < chooseActivity.length; i++) {
      if (chooseActivity[i].length == 0) {
        chooseActivityError.push({ param: 'chooseActivityError', msg: 'You should complete all days', value: '' })
        break;
      }
    }

    if (errors || !(chooseActivityError.length == 0)) {
      let weeksPlans = await WeeksPlans.getWeeksPlans(coachId);
      return res.render('coaches/weeksPlans/new', {
        weeksPlans: weeksPlans,
        errors: errors,
        chooseActivityError: chooseActivityError,
        weekPlanName: weekPlanName
      });
    } else {
      let maxWeekPlanId = await WeeksPlans.max('weekPlanId')
      let weekPlanId;
      if (maxWeekPlanId) {
        weekPlanId = maxWeekPlanId + 1;
      } else {
        weekPlanId = 1;
      }
      let newWeekPlan = new WeeksPlans({
        weekPlanId,
        name: weekPlanName,
        coachId
      });
      WeeksPlans.createWeekPlan(newWeekPlan);
      for (let i = 0; i < chooseActivity.length; i++) {
        switch (chooseActivity[i]) {
          case '1':
            let workoutDay = new WeeksPlansDetails({
              dayNumber,
              weekPlanId,
              workoutId: values[i],
              restDayId: null
            });
            WeeksPlansDetails.createWeekPlanDetails(workoutDay);
            break;
          case '2':
            let restDay = new WeeksPlansDetails({
              dayNumber,
              weekPlanId,
              workoutId: null,
              restDayId: values[i]
            });
            WeeksPlansDetails.createWeekPlanDetails(restDay)
            break;
        }
        dayNumber++;
      }
      return res.redirect('/coachProfile/weekPlans');
    }
  },
  addTimeSlot: async (req, res) => {
    let coachId = req.user.coachId;
    let allDays = req.body;
    let allDaysNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (let i = 0; i < 7; i++) {
      let dayHours = allDays[allDaysNames[i]];
      let lengthOfDay = allDays[allDaysNames[i]].length;
      if (dayHours.length > 0) {
        if (typeof (dayHours) !== 'string') {
          for (let j = 0; j < lengthOfDay; j++) {
            let hour = allDays[allDaysNames[i]][j];
            let dayName = allDaysNames[i];
            let newTimeSlot = new TimeSlots({
              dayName: dayName,
              hour: hour,
              status: 0,
              coachId: coachId
            });
            TimeSlots.addSlot(newTimeSlot);
          }
        } else {
          let hour = allDays[allDaysNames[i]];
          let dayName = allDaysNames[i];
          let newTimeSlot = new TimeSlots({
            dayName: dayName,
            hour: hour,
            status: 0,
            coachId: coachId
          });
          TimeSlots.addSlot(newTimeSlot);
        }
      }
    }
    return res.redirect('/coachProfile/timeSlots');
  },
  removeTimeSlot: async (req, res) => {
    let coachId = req.user.coachId;
    let dayName = req.body.dayName;
    let hour = req.body.hour;
    TimeSlots.removeSlot(coachId, dayName, hour);
    return res.redirect('/coachProfile/timeSlots');
  },
  addGymName: (req, res) => {
    let coachId = req.user.coachId

    let dayName = req.query.dayName;
    let gymId = req.query.gymId;
    let hour = req.query.hour;

    TimeSlots.assignGymToTimeSlot(coachId, dayName, gymId, hour);
  }
}
let coachProfileController = {
  gets: get,
  posts: post
}
module.exports = coachProfileController;
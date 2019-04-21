const Sequelize = require('sequelize');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  workoutId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  workoutName: {
    type: Sequelize.STRING
  },
  coachId: {
    type: Sequelize.INTEGER
  }
};

// 2: Define the Days model.
const WorkoutsModel = module.exports = db.define('workouts', modelDefinition);

module.exports.getCoachWorkouts = (coachId) => {
  return WorkoutsModel.findAll({
    where: {
      coachId: coachId
    }
  });
}
module.exports.getMaxWorkoutId = () => {
  return WorkoutsModel.max('workoutId');
}
module.exports.createWorkout = (newWorkout) => {
  newWorkout.save();
}
module.exports.getWorkout = (workoutId) => {
  return WorkoutsModel.findOne({
    where: {
      workoutId: workoutId
    }
  });
}
module.exports.getCoachWorkouts = (coachId) => {
  return WorkoutsModel.findAll({
    where: {
      coachId: coachId
    }
  });
}
const Sequelize = require('sequelize');
const Exercise = require('./exercises');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  exerciseName: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  sets: {
    type: Sequelize.INTEGER
  },
  reps: {
    type: Sequelize.INTEGER
  },
  workoutId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  coachId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  }
};

// 2: Define the Workouts'Exercises model.
const WorkoutsExercisesModel = module.exports = db.define('workoutsExercises', modelDefinition);

Exercise.hasMany(WorkoutsExercisesModel)
WorkoutsExercisesModel.belongsTo(Exercise)

module.exports.addExercise = (newExercise) => {
  newExercise.save();
}
module.exports.getExercises = (workoutId) => {
  return WorkoutsExercisesModel.findAll({
    where: {
      workoutId: workoutId
    },
    attributes: ['exerciseName', 'sets', 'reps'],
    include: {
      model: Exercise,
      required: true
    }
  });
}
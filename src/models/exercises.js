const Sequelize = require('sequelize');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  name: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  sets: {
    type: Sequelize.INTEGER
  },
  reps: {
    type: Sequelize.INTEGER
  },
  picturePath: {
    type: Sequelize.STRING
  },
  videoLink: {
      type: Sequelize.STRING
  },
  category: {
    type: Sequelize.STRING
  }
};

// 2: Define the User model.
const ExercisesModel = module.exports = db.define('exercises', modelDefinition);

module.exports.getDistinctNamesOfCategories = () => {
  return ExercisesModel.aggregate('category', 'DISTINCT', {plain: false});
}
module.exports.getCategoryExercises = (category) => {
  return ExercisesModel.findAll({
    where: {
      category: category
    }
  });
}
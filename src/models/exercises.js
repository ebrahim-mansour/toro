const Sequelize = require('sequelize');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  name: {
    type: Sequelize.STRING,
    primaryKey: true
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
module.exports.findExerciseByName = async (name) => {
  return ExercisesModel.findOne({
    where: {
      name
    }
  })
}
module.exports.editExercise = async (oldExerciseName, newExerciseName, category, picturePath, videoLink) => {
  ExercisesModel.update(
    {
      name: newExerciseName,
      category,
      picturePath,
      videoLink
    },
    {
      where: {
        name: oldExerciseName
      }
    }
  )
}
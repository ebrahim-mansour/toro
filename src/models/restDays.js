const Sequelize = require('sequelize');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {  
  restDayId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  whatToDo: {
    type: Sequelize.STRING
  },
  video: {
    type: Sequelize.STRING
  },
  coachId: {
    type: Sequelize.INTEGER
  }
};

// 2: Define the Rest Days model.
const RestDaysModel = module.exports = db.define('restDays', modelDefinition);

module.exports.createRestDay = (newRestDay, callback) => {
  newRestDay.save();
  callback();
}
module.exports.getMaxRestDayId = () => {
  return RestDaysModel.max('restDayId');
}
module.exports.getRestDay = (restDayId) => {
  return RestDaysModel.findOne({
    where: {
      restDayId
    }
  });
}
module.exports.getCoachRestDays = (coachId) => {
  return RestDaysModel.findAll({
    where: {
      coachId
    }
  });
}
module.exports.getRestDays = (coachId) => {
  return RestDaysModel.findAll({
    where: {
      coachId
    }
  });
}
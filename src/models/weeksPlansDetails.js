const Sequelize = require('sequelize');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {  
  dayNumber: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  workoutId: {
    type: Sequelize.INTEGER
  },
  restDayId: {
    type: Sequelize.INTEGER
  },
  weekPlanId: {
    type: Sequelize.INTEGER,
  }
};

// 2: Define the Weeks Plans Details model.
const WeeksPlansDetailsModel = module.exports = db.define('weeksPlansDetails', modelDefinition);

module.exports.createWeekPlanDetails = (newWeekPlanDetails) => {
  newWeekPlanDetails.save();
}
module.exports.getWeekPlanById = (weekPlanId) => {
  return WeeksPlansDetailsModel.findAll({
    where: {
      weekPlanId: weekPlanId
    }
  });
}
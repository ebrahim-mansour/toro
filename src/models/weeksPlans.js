const Sequelize = require('sequelize');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {  
  weekPlanId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  coachId: {
    type: Sequelize.INTEGER
  }
};

// 2: Define the Weeks Plans model.
const WeeksPlansModel = module.exports = db.define('weeksPlans', modelDefinition);

module.exports.createWeekPlan = (newWeekPlan) => {
  newWeekPlan.save();
}
module.exports.getWeeksPlans = (coachId) => {
  return WeeksPlansModel.findAll({
    where: {
      coachId: coachId
    }
  });
}
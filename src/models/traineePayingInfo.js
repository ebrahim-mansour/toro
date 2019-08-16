const Sequelize = require('sequelize');

const Trainee = require('./trainee');

const db = require('../services/database');
const Op = Sequelize.Op;

// 1: The model schema.
const modelDefinition = {
  traineeId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  program: {
    type: Sequelize.STRING
  },
  amount: {
    type: Sequelize.INTEGER
  },
  payingDate: {
    type: Sequelize.DATE,
  },
  renewalDate: {
    type: Sequelize.DATE,
  }
};

// 2: Define the Trainee model.
const TraineePayingInfoModel = module.exports = db.define('traineesPayingInfo', modelDefinition);

module.exports.activateProgram = (traineePayingInfo) => {
  // Get the renewal Date date
  let renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1, renewalDate.getDate()); //January is 0!
  
  traineePayingInfo.renewalDate = renewalDate
  traineePayingInfo.save()
}
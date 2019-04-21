const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const User = require('./users');

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
  coachId: {
    type: Sequelize.STRING
  },
  startingDate: {
    type: Sequelize.DATEONLY,
  },
  weight: {
    type: Sequelize.INTEGER,
  },
  height: {
    type: Sequelize.INTEGER
  },
  age: {
    type: Sequelize.INTEGER
  },
  experience: {
    type: Sequelize.STRING,
  },
  picture: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING
  },
};

// 2: Define the Trainee model.
const TraineeModel = module.exports = db.define('trainees', modelDefinition);

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

module.exports.createUser = (newTrainee) => {
  newTrainee.save();
}
module.exports.comparePassword = (candidatePassword, hash) => {
  return bcrypt.compare(candidatePassword, hash);
}
module.exports.addInfo = (traineeId, status, program, coachId, startingDate, weight, height, age, experience) => {
  TraineeModel.update(
    {
      status,
      program,
      coachId,
      startingDate,
      weight,
      height,
      age,
      experience
    },
    {
      where: {
        traineeId
      }
    }
  );
}
module.exports.changeStatus = (traineeId, status) => {
  TraineeModel.update(
    { status: status },
    {
      where: {
        traineeId: traineeId
      }
    }
  );
}
module.exports.startNow = (traineeId, currentDate) => {
  TraineeModel.update(
    { startingDate: currentDate },
    {
      where: {
        traineeId: traineeId
      }
    }
  );
}
module.exports.getTraineesOfSpecificCoach = (coachId) => {
  return TraineeModel.findAll({
    where: {
      startingDate: {
        [Op.lte]: nowDate
      },
      coachId: coachId
    },
    include: {
      model: User,
      required: true
    }
  });
}
module.exports.updateSettings = (coachId, traineeId) => {
  TraineeModel.update(
    { coachId: coachId },
    {
      where: {
        traineeId: traineeId
      }
    }
  );
}
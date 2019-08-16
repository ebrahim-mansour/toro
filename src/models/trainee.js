const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const User = require('./users');
const TraineePayingInfoModel = require('./traineePayingInfo')

const db = require('../services/database');
const Op = Sequelize.Op;

// 1: The model schema.
const modelDefinition = {
  traineeId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  goal: {
    type: Sequelize.STRING
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
  gender: {
    type: Sequelize.STRING
  },
  workTime: {
    type: Sequelize.STRING
  },
  workFinishTime: {
    type: Sequelize.STRING
  },
  gymTime: {
    type: Sequelize.STRING
  },
  sleepTime: {
    type: Sequelize.STRING
  },
  supplements: {
    type: Sequelize.STRING
  },
  sports: {
    type: Sequelize.STRING
  },
  injuries: {
    type: Sequelize.STRING
  },
  paid: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  }
};

// 2: Define the Trainee model.
const TraineeModel = module.exports = db.define('trainees', modelDefinition);

TraineePayingInfoModel.hasMany(TraineeModel, { foreignKey: 'traineeId' })
TraineeModel.belongsTo(TraineePayingInfoModel, { foreignKey: 'traineeId' })

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
module.exports.addInfo = (
  traineeId, status,
  gender, weight, height, age, startingDate, experience,
  injuries, workTime, workFinishTime, gymTime, sleepTime, supplements, sports,
  goal, program,
  coachId
) => {
  TraineeModel.update(
    {
      status,
      gender, weight, height, age, startingDate, experience,
      injuries, workTime, workFinishTime, gymTime, sleepTime, supplements, sports,
      goal, program,
      coachId,
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
module.exports.getTraineeInfo = (traineeId) => {
  return TraineeModel.findOne({
    where: {
      traineeId
    },
    include: {
      model: User,
      required: true
    }
  });
}
module.exports.getTraineePayingInfo = (traineeId) => {  
  return TraineeModel.findOne({
    where: {
      traineeId
    },
    include: {
      model: TraineePayingInfoModel,
      required: true
    }
  });
}
module.exports.getAllTrainees = () => {
  return TraineeModel.findAll({
    include: {
      model: User,
      required: true
    }
  });
}
module.exports.getTraineesOfSpecificCoach = (coachId) => {
  return TraineeModel.findAll({
    where: {
      startingDate: {
        [Op.lte]: nowDate
      },
      coachId: coachId,
      paid: true
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
module.exports.checkIfRoomExists = (roomId) => {
  return TraineeModel.findOne({
    where: {
      traineeId: roomId
    }
  })
}
module.exports.getAllTraineesIds = () => {
  return TraineeModel.findAll({
    attributes: ['traineeId'],
    order: [
      ['traineeId', 'ASC']
    ],
  });
}
module.exports.activateProgram = (traineeId) => {
  TraineeModel.update(
    { paid: true },
    {
      where: {
        traineeId
      }
    }
  );
}
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const Workout = require('./workouts');
const RestDay = require('./restDays');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  dayNumber: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  dayDate: {
    type: Sequelize.DATEONLY
  },
  whenToStart: {
    type: Sequelize.DATEONLY
  },
  status: {
    type: Sequelize.INTEGER
  },
  traineeId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  workoutId: {
    type: Sequelize.INTEGER,
  },
  restDayId: {
    type: Sequelize.INTEGER
  }
};

// 2: Define the Days model.
const DaysModel = module.exports = db.define('days', modelDefinition);

DaysModel.hasMany(Workout, { foreignKey: 'workoutId', sourceKey: 'workoutId' })
Workout.belongsTo(DaysModel, { foreignKey: 'workoutId' })

DaysModel.hasMany(RestDay, { foreignKey: 'restDayId', sourceKey: 'restDayId' })
RestDay.belongsTo(DaysModel, { foreignKey: 'restDayId' })

module.exports.createDay = (newDay) => {
  newDay.save();
}
module.exports.getAllTraineeDays = (traineeId) => {
  return DaysModel.findAll({
    where: {
      traineeId
    }
  });
}
module.exports.getAllTraineeAvailableDays = (traineeId, whenToStart) => {
  return DaysModel.findAll({
    where: {
      traineeId,
      whenToStart: {
        [Op.lte]: whenToStart
      },
    }
  });
}
module.exports.getDaysWorkoutsAndRestDays = (traineeId) => {
  return DaysModel.findAll({
    where: {
      traineeId,
    },
    order: [
      ['dayNumber', 'ASC']
    ],
    include: [
      { model: Workout },
      { model: RestDay }
    ]
  });
}
module.exports.getDay = (traineeId, dayNumber) => {
  return DaysModel.findOne({
    where: {
      traineeId,
      dayNumber
    }
  });
}
module.exports.deleteDay = (traineeId, dayNumber) => {
  return DaysModel.destroy({
    where: {
      dayNumber,
      traineeId
    }
  });
}
module.exports.resetDays = (traineeId) => {
  return DaysModel.destroy({
    where: {
      traineeId,
      status: {
        [Op.notIn]: ['done', 'done and has a private session']
      }
    }
  });
}
module.exports.updateDayWorkout = (traineeId, dayNumber, workoutId,) => {
  return DaysModel.update(
    {
      workoutId,
      restDayId: null
    },
    {
      where: {
        traineeId,
        dayNumber
      }
    }
  );
}
module.exports.updateDayRestDay = (traineeId, dayNumber, restDayId,) => {
  return DaysModel.update(
    {
      restDayId,
      workoutId: null
    },
    {
      where: {
        traineeId,
        dayNumber
      }
    }
  );
}
module.exports.updateDayStatus = (status, traineeId, dayNumber) => {
  DaysModel.update(
    { status },
    {
      where: {
        traineeId,
        dayNumber
      }
    }
  );
}
module.exports.updateDayStatusAndDate = (status, date, traineeId, dayNumber) => {
  DaysModel.update(
    {
      status,
      whenToStart: date
    },
    {
      where: {
        traineeId,
        dayNumber
      }
    }
  );
}
module.exports.removeTraineeDays = (traineeId) => {
  return DaysModel.destroy({
    where: {
      traineeId
    }
  });
}
module.exports.getMaxDay = (traineeId) => {
  return DaysModel.max('dayNumber', {
    where: {
      traineeId
    }
  });
}
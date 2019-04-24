const Sequelize = require('sequelize');

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

module.exports.getDayData = (traineeId) => {
  return DaysModel.findAll({
    where: {
      traineeId: traineeId
    }
  });
}
module.exports.createDay = (newDay) => {
  newDay.save();
}
module.exports.getDaysWorkoutsAndRestDays = (traineeId) => {
  return DaysModel.findAll({
    where: {
      traineeId: traineeId,
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
      traineeId: traineeId,
      dayNumber: dayNumber
    }
  })
}
module.exports.deleteDay = (traineeId, dayNumber) => {
  return DaysModel.destroy({
    where: {
      dayNumber,
      traineeId
    }
  });
}
module.exports.updateDayStatusAndDate = (status, date, traineeId, dayNumber) => {
  DaysModel.update(
    {
      status: status,
      whenToStart: date
    },
    {
      where: {
        traineeId: traineeId,
        dayNumber: dayNumber
      }
    }
  );
}
module.exports.updateDayStatus = (status, traineeId, dayNumber) => {
  DaysModel.update(
    { status: status },
    {
      where: {
        traineeId: traineeId,
        dayNumber: dayNumber
      }
    }
  );
}
module.exports.getMaxDay = (traineeId) => {
  return DaysModel.max('dayNumber', {
    where: {
      traineeId: traineeId
    }
  });
}
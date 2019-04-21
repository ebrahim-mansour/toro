const Sequelize = require('sequelize');
const Op = Sequelize.Op

const DayHours = require('./reservedHours');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  dayName: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  hour: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  status: {
    type: Sequelize.INTEGER
  },
  coachId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  gymId: {
    type: Sequelize.INTEGER
  }
};

// 2: Define the Days model.
const TimeSlotsModel = module.exports = db.define('timeSlots', modelDefinition);

TimeSlotsModel.hasMany(DayHours, { foreignKey: 'dayName' })
DayHours.belongsTo(TimeSlotsModel, { foreignKey: 'dayName' })

module.exports.addSlot = (newTimeSlot) => {
  newTimeSlot.save();
}
module.exports.removeSlot = (coachId, dayName, hour) => {
  TimeSlotsModel.destroy({
    where: {
      coachId: coachId,
      dayName: dayName,
      hour: hour
    }
  })
}
module.exports.assignGymToTimeSlot = (coachId, dayName, gymId, hour) => {
  if (gymId == "") {
    TimeSlotsModel.update(
      {
        gymId: null
      },
      {
        where: {
          coachId: coachId,
          dayName: dayName,
          hour: hour
        }
      }
    );
  } else {
    TimeSlotsModel.update(
      {
        gymId: gymId
      },
      {
        where: {
          coachId: coachId,
          dayName: dayName,
          hour: hour
        }
      }
    );
  }
}
module.exports.getTimeSlots = (coachId) => {
  return TimeSlotsModel.findAll({
    where: {
      coachId: coachId
    },
    attributes: ['dayName', 'hour', 'status', 'gymId']
  });
}
module.exports.getAvailableTimeSlotsOfCoach = (coachId) => {
  return TimeSlotsModel.findAll({
    where: {
      coachId: coachId,
      gymId: {
        [Op.ne]: null
      },
      status: 0
    }
  });
}
module.exports.updateHourStatus = (dayName, hour, coachId) => {
  TimeSlotsModel.update(
    { status: 1 },
    {
      where: {
        dayName: dayName,
        hour: hour,
        coachId: coachId
      }
    }
  );
}
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const TimeSlots = require('./timeSlots')

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  gymId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  location: {
    type: Sequelize.STRING
  }
};

// 2: Define the Days model.
const GymsModel = module.exports = db.define('gyms', modelDefinition);

TimeSlots.hasMany(GymsModel, { foreignKey: 'gymId', sourceKey: 'gymId' })
GymsModel.belongsTo(TimeSlots, { foreignKey: 'gymId', targetKey: 'gymId' })

module.exports.getAllGyms = () => {
  return GymsModel.findAll();
}
module.exports.getTimeSlotsWithGyms = (coachId) => {
  return GymsModel.findAll({
    include: {
      model: TimeSlots,
      required: true,
      where: {
        coachId: coachId
      }
    }
  });
}
module.exports.getTimeSlotsOfSpecificDay = (dayName, coachId) => {
  return TimeSlots.findAll({
    where: {
      dayName: dayName,
      status: 0,
      coachId: coachId,
      gymId: {
        [Op.ne]: null
      }
    },
    order: [
      ['hour', 'ASC']
    ],
    attributes: ['dayName', 'hour', 'gymId'],
    include: {
      model: GymsModel,
      required: true
    }
  });
}
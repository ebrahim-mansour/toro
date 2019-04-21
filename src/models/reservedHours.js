const Sequelize = require('sequelize');

const User = require('./users');
const Trainee = require('./trainee');

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
  coachId: {
    type: Sequelize.INTEGER
  },
  reservationDate: {
    type: Sequelize.DATEONLY
  },
  traineeId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  }
};

// 2: Define the Days model.
const DaysHoursModel = module.exports = db.define('reservedHours', modelDefinition);

Trainee.hasMany(DaysHoursModel, { foreignKey: 'traineeId' })
DaysHoursModel.belongsTo(Trainee, { foreignKey: 'traineeId' })

User.hasMany(DaysHoursModel, { foreignKey: 'traineeId' })
DaysHoursModel.belongsTo(User, { foreignKey: 'traineeId' })

module.exports.addReservedHours = (newHour) => {
  newHour.save();
}
module.exports.getDaysHours = (coachId) => {
  return DaysHoursModel.findAll({
    where: {
      coachId: coachId,
    },
    order: [
      ['reservationDate', 'ASC']
    ],
    include: [
      {
        model: Trainee,
        required: true
      },
      {
        model: User,
        required: true
      }
    ]
  });
}
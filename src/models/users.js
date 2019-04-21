const Sequelize = require('sequelize');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  userName: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.INTEGER,
  },
  registrationDate: {
    type: Sequelize.DATE
  }
};

// 2: Define the User model.
const UsersModel = module.exports = db.define('users', modelDefinition);

module.exports.phoneAlreadyExist = (phone) => {
  return UsersModel.findOne({
    where: {
      phone: phone
    }
  })
}
module.exports.getMaxId = () => {
  return UsersModel.max('id');
}
module.exports.createUser = (newUser) => {
  newUser.save();
}
module.exports.updateSettings = (firstName, lastName, userName, phone, id) => {
  UsersModel.update(
    {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      phone: phone
    },
    {
      where: {
        id: id
      }
    }
  );
}
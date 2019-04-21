const Sequelize = require('sequelize');
const Op = Sequelize.Op

const bcrypt = require('bcrypt');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  role: {
    type: Sequelize.INTEGER,
  }
};

// 2: Define the Login model.
const LoginModel = module.exports = db.define('login', modelDefinition);

module.exports.emailAlreadyExist = (email) => {
  return LoginModel.findOne({
    where: {
      email: email
    }
  });
}
module.exports.createUser = (newCoach) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newCoach.password, salt, (err, hash) => {
      newCoach.password = hash;
      newCoach.save();
    });
  });
}
module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}
module.exports.getLoginData = (id) => {
  return LoginModel.findOne({
    where: {
      id: id
    }
  });
}
module.exports.updateSettings = (email, newHash, id) => {
  LoginModel.update(
    {
      email: email,
      password: newHash
    },
    {
      where: {
        id: id
      }
    }
  );
}
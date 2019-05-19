const Sequelize = require('sequelize');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  message: {
    type: Sequelize.STRING,
  },
  senderName: {
    type: Sequelize.STRING,
  },
  roomId: {
    type: Sequelize.INTEGER,
  },
  timestamp: {
    type: Sequelize.DATE
  }
};

// 2: Define the Login model.
const ChatModel = module.exports = db.define('chat', modelDefinition);

module.exports.addMessage = (newMessage) => {
  newMessage.save();
}
module.exports.getMessagesOfRoom = (roomId) => {
  return ChatModel.findAll({
    where: {
      roomId
    },
    attributes: ['message', 'senderName', 'timestamp']
  });
}
module.exports.getLastMessageIdOfRoom = (roomId) => {
  return ChatModel.max('id', {
    where: {
      roomId
    }
  });
}
module.exports.getLastMessageOfRoom = (id) => {
  return ChatModel.findOne({
    where: {
      id
    },
    attributes: ['message', 'timestamp', 'senderName']
  });
}
module.exports.getMaxId = () => {
  return ChatModel.max('id');
}
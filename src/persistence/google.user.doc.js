const GoogleUser = require('../models/google.user.model');
const responseMessage = require('../constants/api-response-messages');

const getUserById = async (id) => {
  try {
    return await GoogleUser.findById(id).exec();
  } catch(err) {
    console.error(err);
    return responseMessage.DATABASE.ERROR;
  }
}

const getByRole = async (role) => {
  try {
    return await GoogleUser.find({ role: role }).exec();
  } catch(err) {
    console.error(err);
    return responseMessage.DATABASE.ERROR;
  }
}

const getByNickname = async (nickname) => {
  try {
    return await GoogleUser.findOne({ nickname: nickname }).exec();
  } catch(err) {
    console.error(err);
    return responseMessage.DATABASE.ERROR;
  }
}

const getAll = async () => {
  try {
    return await GoogleUser.find({}).exec();
  } catch(err) {
    console.error(err);
    return responseMessage.DATABASE.ERROR;
  }
}

module.exports = {
  getUserById: getUserById,
  getByRole: getByRole,
  getAll: getAll,
  getByNickname: getByNickname
  // getUserByUsername: getUserByUsername,
}

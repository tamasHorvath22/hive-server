const GoogleUser = require("../models/google.user.model");
const RegisterTokenDoc = require("../persistence/register.token.doc");
const UserTransaction = require("../persistence/user.transaction");
const jwt = require("jsonwebtoken");
const config = require("../config");
const responseMessage = require("../constants/api-response-messages");
const mongoose = require('mongoose');

module.exports = {
  handleAuthUser: handleAuthUser
};

async function handleAuthUser(userDto) {
  let user = await GoogleUser.findOne({ nickname: userDto.nickname });
  if (!user) {
    // let savedToken = await RegisterTokenDoc.getById(userDto.token);
    // if (savedToken === responseMessage.DATABASE.ERROR) {
    //   return responseMessage.DATABASE.ERROR;
    // }
    // if (!savedToken) {
    //   return responseMessage.REGISTER.TOKEN_ERROR;
    // }
    const newUser = GoogleUser({
      nickname: userDto.nickname,
      firstname: userDto.firstname,
      lastname: userDto.lastname,
      role: null
    });
    user = await UserTransaction.registerUser(newUser);
    if (!user) {
      return responseMessage.REGISTER.TOKEN_ERROR;
    }
  }
  const token = generateServerJwtToken(user);
  return token;
}

function generateServerJwtToken(user) {
  return jwt.sign({
    userId: user._id,
    nickname: user.nickname,
    firstname: user.firstname,
    lastname: user.lastname
  },
  config.getJwtPrivateKey());
}

const GoogleUser = require("../models/google.user.model");
const GoogleUserDoc = require("../persistence/google.user.doc");
const ApiaryDoc = require("../persistence/apiary.doc");
const RegisterTokenDoc = require("../persistence/register.token.doc");
const UserTransaction = require("../persistence/user.transaction");
const jwt = require("jsonwebtoken");
const config = require("../config");
const responseMessage = require("../constants/api-response-messages");
const mongoose = require('mongoose');
const ApiaryTransactions = require('../persistence/apiary-transactions');


const handleAuthUser = async (userDto) => {
  let user = await GoogleUser.findOne({ nickname: userDto.nickname });
  if (!user && userDto.token) {
    let savedToken
    try {
      savedToken = await RegisterTokenDoc.getById(userDto.token);
    } catch (e) {
      return responseMessage.DATABASE.ERROR;
    }
    if (savedToken === responseMessage.DATABASE.ERROR) {
      return responseMessage.DATABASE.ERROR;
    }
    if (!savedToken) {
      return responseMessage.REGISTER.TOKEN_ERROR;
    }
    const apiary = await ApiaryDoc.getById(savedToken.apiaryId);
    if (!apiary || apiary === responseMessage.DATABASE.ERROR) {
      return responseMessage.DATABASE.ERROR;
    }
    const newUser = GoogleUser({
      nickname: userDto.nickname,
      firstname: userDto.firstname,
      lastname: userDto.lastname,
      apiaries: [savedToken.apiaryId]
    });
    apiary.collaborators.push(newUser._id.toString());
    user = await UserTransaction.registerUserDeleteToken(newUser, savedToken, apiary);
  }
  if (!user && !userDto.token) {
    const newUser = GoogleUser({
      nickname: userDto.nickname,
      firstname: userDto.firstname,
      lastname: userDto.lastname,
      apiaries: []
    });
    user = await UserTransaction.registerUser(newUser);
    if (!user) {
      return responseMessage.REGISTER.TOKEN_ERROR;
    }
  }
  const token = generateServerJwtToken(user);
  return token;
}

const getUsersContainingText = async (text, userId, apiaryId) => {
  const gmailSuffix = '@gmail.com';
  const user = await GoogleUserDoc.getUserById(userId);
  const apiary = await ApiaryDoc.getById(apiaryId);
  if (
    !user ||
    user === responseMessage.DATABASE.ERROR ||
    !apiary ||
    apiary === responseMessage.DATABASE.ERROR ||
    apiary.owner.toString() !== userId
  ) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const allUsers = await GoogleUserDoc.getAll();
  if (!allUsers || allUsers === responseMessage.DATABASE.ERROR) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  if (!text) {
    return [];
  }
  const excludedCollaborators = await excludeOwnerAndCollaborators(apiary, allUsers);
  const filteredUsers = excludedCollaborators.filter(user => {
    const email = `${user.nickname.toLowerCase()}${gmailSuffix}`;
    const textLower = text.toLowerCase();
    return email.includes(textLower);
  }).map(user => `${user.nickname}${gmailSuffix}`);
  return filteredUsers;
}

const excludeOwnerAndCollaborators = async (apiary, allUsers) => {
  const nicknames = [];
  const collaborators = apiary.collaborators;
  collaborators.push(apiary.owner);
  for (const id of collaborators) {
    const user = await GoogleUserDoc.getUserById(id.toString());
    if (!user || user === responseMessage.DATABASE.ERROR) {
      continue;
    }
    nicknames.push(user.nickname)
  }
  const filteredUsers = allUsers.filter(user => !nicknames.includes(user.nickname));
  return filteredUsers;
}

const inviteRegisteredUser = async (data) => {
  const user = await GoogleUserDoc.getUserById(data.userId);
  const apiary = await ApiaryDoc.getById(data.apiaryId);
  if (
    !user ||
    user === responseMessage.DATABASE.ERROR ||
    !apiary ||
    apiary === responseMessage.DATABASE.ERROR ||
    apiary.owner.toString() !== data.userId
  ) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const nickname = data.email.split('@')[0];
  const userByEmail = await GoogleUserDoc.getByNickname(nickname);
  if (!userByEmail || userByEmail === responseMessage.DATABASE.ERROR) {
    return { error: responseMessage.USER.NOT_FOUND };
  }
  apiary.collaborators.push(userByEmail._id.toString());
  userByEmail.apiaries.push(apiary._id.toString());
  const result = await ApiaryTransactions.saveApiaryAndUser(apiary, userByEmail);
  if (result) {
    return result;
  } else {
    return { error: responseMessage.DATABASE.ERROR };
  }
}

const generateServerJwtToken = (user) => {
  return jwt.sign({
    userId: user._id,
    nickname: user.nickname,
    firstname: user.firstname,
    lastname: user.lastname
  },
  config.getJwtPrivateKey());
}

module.exports = {
  handleAuthUser: handleAuthUser,
  getUsersContainingText: getUsersContainingText,
  inviteRegisteredUser: inviteRegisteredUser
};

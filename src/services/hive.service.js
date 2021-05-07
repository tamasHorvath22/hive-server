const GoogleUserDoc = require('../persistence/google.user.doc');
const ApiaryDoc = require('../persistence/apiary.doc');
const ApiaryTransactions = require('../persistence/apiary-transactions');
const Apiary = require('../models/apiary.model');
const responseMessage = require('../constants/api-response-messages');

const getUserDataApi = async (userId) => {
  const user = await GoogleUserDoc.getUserById(userId.toString());
  if (!user || user === responseMessage.DATABASE.ERROR) {
    return responseMessage.DATABASE.ERROR;
  }
  const apiaries = await ApiaryDoc.getMoreByIds(user.apiaries);
  if (!apiaries || apiaries === responseMessage.DATABASE.ERROR) {
    return responseMessage.DATABASE.ERROR;
  }
  return mapApiaryData(apiaries);
}

const mapApiaryData = (apiaries) => {
  return apiaries.map(apiary => {
    return {
      name: apiary.name,
      id: apiary._id.toString()
    };
  })
}

const createApiaryApi = async (name, userId) => {
  const user = await GoogleUserDoc.getUserById(userId.toString());
  if (!user || user === responseMessage.DATABASE.ERROR) {
    return responseMessage.DATABASE.ERROR;
  }
  const result = await createApiary(name, user);
  if (!result) {
    return responseMessage.DATABASE.ERROR;
  }
  const savedUser = result[1];
  if (!savedUser) {
    return responseMessage.DATABASE.ERROR;
  }
  return getUserDataApi(savedUser._id);
}

const createApiary = async (name, user) => {
  const newApiary = Apiary({
    name: name,
    owner: user._id,
    sites: [],
    hives: [],
    collaborators: []
  });
  user.apiaries.push(newApiary._id);
  try {
    return await ApiaryTransactions.saveApiaryAndUser(newApiary, user);
  } catch (err) {
    console.log(err);
    return false;
  }
} 

module.exports = {
  getUserDataApi: getUserDataApi,
  createApiaryApi: createApiaryApi
};

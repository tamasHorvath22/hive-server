const GoogleUserDoc = require('../persistence/google.user.doc');
const ApiaryDoc = require('../persistence/apiary.doc');
const ApiaryTransactions = require('../persistence/apiary-transactions');
const Apiary = require('../models/apiary.model');
const responseMessage = require('../constants/api-response-messages');

const getUserDataApi = async (userId) => {
  const user = await GoogleUserDoc.getUserById(userId.toString());
  if (!user || user === responseMessage.DATABASE.ERROR) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const apiaries = await ApiaryDoc.getMoreByIds(user.apiaries);
  if (!apiaries || apiaries === responseMessage.DATABASE.ERROR) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  return mapApiaryData(apiaries);
}

const getApiaryDataApi = async (apiaryId, userId) => {
  const apiary = await ApiaryDoc.getById(apiaryId);
  const user = await GoogleUserDoc.getUserById(userId.toString());
  if (
    !apiary ||
    apiary === responseMessage.DATABASE.ERROR ||
    !user ||
    user === responseMessage.DATABASE.ERROR
  ) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  // TODO check if user has rights for apiary
  return apiary;
}

const mapApiaryData = (apiaries) => {
  return apiaries.map(apiary => {
    return {
      name: apiary.name,
      id: apiary._id.toString()
    };
  })
}

const isApiaryNameWrong = (name) => {
  return typeof name !== 'string' || !name;
}

const isSiteNameWrong = (siteName) => {
  return typeof siteName !== 'string' || !siteName;
}

const addSite = async (data, userId) => {
  if (isSiteNameWrong(data.siteName)) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const apiary = await ApiaryDoc.getById(data.apiaryId);
  const user = await GoogleUserDoc.getUserById(userId.toString());
  if (
    !apiary ||
    apiary === responseMessage.DATABASE.ERROR ||
    !user ||
    user === responseMessage.DATABASE.ERROR
  ) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  apiary.sites.push(data.siteName);
  const result = await ApiaryTransactions.saveApiary(apiary);
  if (result) {
    return result;
  } else {
    return { error: responseMessage.DATABASE.ERROR };
  }
}

const createApiaryApi = async (name, userId) => {
  if (isApiaryNameWrong(name)) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const user = await GoogleUserDoc.getUserById(userId.toString());
  if (!user || user === responseMessage.DATABASE.ERROR) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const result = await createApiary(name, user);
  if (!result) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const savedUser = result[1];
  if (!savedUser) {
    return { error: responseMessage.DATABASE.ERROR };
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
  createApiaryApi: createApiaryApi,
  addSite: addSite,
  getApiaryDataApi: getApiaryDataApi
};

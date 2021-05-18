const GoogleUserDoc = require('../persistence/google.user.doc');
const ApiaryDoc = require('../persistence/apiary.doc');
const ApiaryTransactions = require('../persistence/apiary-transactions');
const Apiary = require('../models/apiary.model');
const Site = require('../models/site.model');
const Hive = require('../models/hive');
const RegisterToken = require('../models/register.token');
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
    !apiary || apiary === responseMessage.DATABASE.ERROR ||
    !user || user === responseMessage.DATABASE.ERROR
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

const isStringWrong = (value) => {
  return typeof value !== 'string' || !value;
}

const isUserAuthorized = (apiary, userId) => {
  const isOwner = apiary.owner.toString() === userId.toString();
  const isCollaborator = isUserCollaborator(apiary.collaborators, userId);
  return isOwner || isCollaborator;
}

const addSite = async (data, userId) => {
  if (isStringWrong(data.siteName)) {
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
  if (!isUserAuthorized(apiary, userId)) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const newSite = Site({
    name: data.siteName,
    creator: userId
  });
  apiary.sites.push(newSite);
  const result = await ApiaryTransactions.saveApiary(apiary);
  if (result) {
    return result;
  } else {
    return { error: responseMessage.DATABASE.ERROR };
  }
}

const createApiaryApi = async (name, userId) => {
  if (isStringWrong(name)) {
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

const isSiteIdInvald = (sites, siteId) => {
  for (const site of sites) {
    if (site._id.toString() === siteId.toString()) {
      return false;
    }
  }
  return true;
}

const findLowestHiveNumber = (hives) => {
  if (!hives.length) {
    return 1;
  }
  const hiveNumbers = hives.map(h => h.number).sort((a, b) => a - b);
  for (let i = 0; i < hiveNumbers.length - 1; i++) {
    if (hiveNumbers[i] + 1 !== hiveNumbers[i + 1]) {
      return hiveNumbers[i] + 1;
    }
  }
  return hiveNumbers[hiveNumbers.length - 1] + 1;
}

const createHiveApi = async (data, userId) => {
  const apiary = await ApiaryDoc.getById(data.apiaryId);
  if (!apiary || apiary === responseMessage.DATABASE.ERROR) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  if (!isUserAuthorized(apiary, userId) || isSiteIdInvald(apiary.sites, data.siteId)) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const newHive = Hive({
    number: findLowestHiveNumber(apiary.hives),
    creator: userId,
    posts: [],
    site: data.siteId,
  });
  apiary.hives.push(newHive);
  const result = await ApiaryTransactions.saveApiary(apiary);
  if (result) {
    return result;
  } else {
    return { error: responseMessage.DATABASE.ERROR };
  }
}

const findElemById = (array, id) => {
  if (!array || !array.length || !id) {
    return null;
  }
  return array.find(e => e._id.toString() === id.toString());
}

const isUserCollaborator = (collaborators, userId) => {
  for (const collaborator of collaborators) {
    if (collaborator.toString() === userId.toString()) {
      return true;
    }
  }
  return false;
}

const updateHiveApi = async (data, userId) => {
  const apiary = await ApiaryDoc.getById(data.apiaryId);
  if (!apiary || apiary === responseMessage.DATABASE.ERROR) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  if (!isUserAuthorized(apiary, userId)) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const site = findElemById(apiary.sites, data.siteId);
  const hive = findElemById(apiary.hives, data.hiveId);
  if (!site || !hive) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  hive.site = site._id;
  const result = await ApiaryTransactions.saveApiary(apiary);
  if (result) {
    return result;
  } else {
    return { error: responseMessage.DATABASE.ERROR };
  }
}

const createInviteLink = async (apiaryId, userId) => {
  const apiary = await ApiaryDoc.getById(apiaryId);
  if (!apiary || apiary === responseMessage.DATABASE.ERROR || apiary.owner.toString() !== userId) {
    return { error: responseMessage.DATABASE.ERROR };
  }
  const token = RegisterToken({
    apiaryId: apiary._id.toString(),
    expiresAt: new Date().getTime() + 1000 * 60* 60 * 24 * 7
  })
  token.save();
  return { token: token._id.toString() };
}

module.exports = {
  getUserDataApi: getUserDataApi,
  createApiaryApi: createApiaryApi,
  addSite: addSite,
  getApiaryDataApi: getApiaryDataApi,
  createHiveApi: createHiveApi,
  updateHiveApi: updateHiveApi,
  createInviteLink: createInviteLink
};

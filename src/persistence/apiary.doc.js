const Apiary = require('../models/apiary.model');
const responseMessage = require('../constants/api-response-messages');
const mongoose = require('mongoose');

module.exports = {
  getById: getById,
  getMoreByIds: getMoreByIds
}

async function getById(id) {
  try {
    return await Apiary.findById(id).exec();
  } catch(err) {
    console.error(err);
    return responseMessage.DATABASE.ERROR;
  }
}

async function getMoreByIds(idList) {
  const mongooseIdArray = [];
  idList.forEach(apiaryId => {
    mongooseIdArray.push(mongoose.Types.ObjectId(apiaryId))
  });
  try {
    return await Apiary.find({ _id: { $in: mongooseIdArray } });
  } catch(err) {
    console.error(err);
    return responseMessage.DATABASE.ERROR;
  }
}

// async function getAll() {
//   try {
//     return await Realm.find({}).exec();
//   } catch(err) {
//     console.error(err);
//     return responseMessage.DATABASE.ERROR;
//   }
// }

// async function remove(realmName) {
//   try {
//     const realm = Realm.findOne({ name: realmName })
//     await realm.remove().exec();
//   } catch(err) {
//     console.error(err);
//     return responseMessage.DATABASE.ERROR;
//   }
// }

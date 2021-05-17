const Transaction = require('mongoose-transactions');
const schemas = require('../constants/schemas');

const saveApiary = async (apiary) => {
  const transaction = new Transaction(true);
  apiary.markModified('sites');
  apiary.markModified('hives');
  apiary.markModified('collaborators');
  transaction.insert(schemas.APIARY, apiary);
  try {
    const result = await transaction.run();
    return result[0];
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return false;
  }
}

const saveApiaryAndUser = async (apiary, user) => {
  const transaction = new Transaction(true);
  apiary.markModified('sites');
  apiary.markModified('hives');
  apiary.markModified('collaborators');
  transaction.insert(schemas.APIARY, apiary);
  transaction.insert(schemas.GOOGE_USER, user);
  try {
    const result = await transaction.run();
    return result;
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return false;
  }
}

module.exports = {
  saveApiary: saveApiary,
  saveApiaryAndUser: saveApiaryAndUser
}

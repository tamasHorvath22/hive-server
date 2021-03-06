const Transaction = require('mongoose-transactions');
const schemas = require('../constants/schemas');

const registerUserDeleteToken = async (googleUser, token, realm) => {
  const transaction = new Transaction(true);
  if (realm) {
    realm.markModified('students');
    realm.markModified('clans');
    realm.markModified('monsters');
  }
  transaction.insert(schemas.GOOGE_USER, googleUser);
  transaction.remove(schemas.REGISTER_TOKEN, token);
  if (realm) {
    transaction.insert(schemas.REALM, realm);
  }
  try {
    const result = await transaction.run();
    return result[0];
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return false;
  }
}

const registerUser = async (googleUser) => {
  const transaction = new Transaction(true);
  transaction.insert(schemas.GOOGE_USER, googleUser);
  try {
    const result = await transaction.run();
    return result[0];
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return false;
  }
}

module.exports = {
  registerUserDeleteToken: registerUserDeleteToken,
  registerUser: registerUser
}

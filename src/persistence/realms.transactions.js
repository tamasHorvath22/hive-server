const Transaction = require('mongoose-transactions');
const schemas = require('../constants/schemas');

const saveRealm = async (realm) => {
  const transaction = new Transaction(true);
  realm.markModified('students');
  realm.markModified('clans');
  realm.markModified('monsters');
  transaction.insert(schemas.REALM, realm);
  try {
    const result = await transaction.run();
    return result[0];
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return false;
  }
}

const saveRealmAndBackup = async (realm, backup) => {
  const transaction = new Transaction(true);
  realm.markModified('students');
  realm.markModified('clans');
  realm.markModified('monsters');
  backup.markModified('realms');
  transaction.insert(schemas.REALM, realm);
  transaction.insert(schemas.BACKUP_LIST, backup);
  try {
    const result = await transaction.run();
    return result[0];
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return false;
  }
}

const saveRealmAndRegisterTokens = async (realm, registerTokens) => {
  const transaction = new Transaction(true);
  realm.markModified('students');
  realm.markModified('clans');
  realm.markModified('monsters');
  transaction.insert(schemas.REALM, realm);
  registerTokens.forEach(token => {
    transaction.insert(schemas.REGISTER_TOKEN, token);
  });
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
  saveRealm: saveRealm,
  saveRealmAndBackup: saveRealmAndBackup,
  saveRealmAndRegisterTokens: saveRealmAndRegisterTokens
}

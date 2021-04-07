// const responseMessage = require("../constants/api-response-messages");
// const RealmDoc = require('../persistence/realm.doc');
// const GoogleUserDoc = require('../persistence/google.user.doc');
// const Realm = require('../models/realm.model');
// const Clan = require('../models/clan.model');
// const Student = require('../models/student.model');
// const RegisterToken = require('../models/register.token');
// // const ClassDoc = require('../persistence/classes.doc');
// const BackupDoc = require('../persistence/backup.doc');
// const RegisterTokenDoc = require('../persistence/register.token.doc');
// const StudProp = require('../constants/student.properties');
// const Classes = require('../constants/classes');
// const Monsters = require('../constants/monsters');
// const Roles = require('../constants/roles');
// const ClanTresholds = require('../constants/clan.tresholds');
// const RealmTransaction = require('../persistence/realms.transactions');
// const SheetService = require('./sheet.service')
// const Backup = require('../models/backup.model');
// const ClanPointTypes = require('../constants/clan.point.types');
// const validIncomingPointTypes = require('../constants/valid.incoming.point.types');
// const validIncomingClanPointTypes = require('../constants/valid.incoming.clan.point.types');
// const ClassesWithTresholds = require('../constants/classes.with.tresholds');
// const mongoose = require('mongoose');


// const isAuthorized = (realm, userId) => {
//   const collaborators = realm.collaborators.map(c => c.toString());
//   return collaborators.includes(userId.toString());
// }

// const addValueApi = async (data, userId) => {
//   // Typecheck of input data. If pointType, value, isDuel or isWinner not from expected type, the function returns
//   const areTypesWrong = areAddValueTypesWrong(data);
//   if (areTypesWrong) {
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   const realm = await RealmDoc.getById(data.realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     // if no realm found, the function returns with database error.
//     // the reason of no realm can be invalid realmId also
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const student = findElemById(realm.students, data.studentId);
//   if (!student) {
//     // if the studentId is invalid and no student found, the function returns with common error
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   const clanLevel = getStudentClanLevel(student.clan, realm.clans);
//   const clanFortressLevel = getStudentClanFortressLevel(student.clan, realm.clans);
//   const modifiedStudent = addValue(data, student, clanLevel, clanFortressLevel);
//   if (data.isDuel && data.isWinner && student.clan) {
//     const gloryPointsForDuelWin = 5;
//     const studentClan = findElemById(realm.clans, student.clan);
//     const prevClanLevel = studentClan.level;
//     manageClanGloryPointsAndLevelUp(studentClan, gloryPointsForDuelWin);
//     handleClanLevelUpCloakChange(realm.students, studentClan, prevClanLevel);
//   }
//   const result = await RealmTransaction.saveRealm(realm);
//   return result ? result : responseMessage.DATABASE.ERROR;
// }

// const getStudentClanFortressLevel = (studentClan, clans) => {
//   let clanFortressLevel = 0;
//   const clan = findElemById(clans, studentClan);
//   if (clan) {
//     clanFortressLevel = clan.fortress;
//   }
//   return clanFortressLevel;
// }

// const areAddValueTypesWrong = (data) => {
//   return (
//     !validIncomingPointTypes.includes(data.pointType) ||
//     typeof data.value !== 'number' ||
//     typeof data.isDuel !== "boolean" ||
//     typeof data.isWinner !== "boolean"
//   )
// }

// const addValue = (data, student, clanLevel, clanFortressLevel) => {
//   const inputModifier = data.pointType === StudProp.MANA_POINTS ? clanFortressLevel * 5 : 0;
//   student[data.pointType] = countModifiedValue(
//     student,
//     data.value,
//     data.pointType,
//     data.isDuel,
//     clanLevel,
//     false,
//     inputModifier
//   );
//   if (data.pointType === StudProp.MANA_POINTS && data.value < 0) {
//     student[StudProp.SKILL_COUNTER]++;
//     student[StudProp.PET_FOOD]++;
//     if (student.class === Classes.ADVENTURER) {
//       student[StudProp.PET_FOOD]++;
//     }
//   }
//   if (data.isDuel) {
//     student[StudProp.DUEL_COUNT]++;
//   }
//   return student;
// };

// const manageClanGloryPointsAndLevelUp = (studentClan, value) => {
//   // finds the next level, even if it is an addition or substaction
//   // if it is a substaction, the next level is the current level
//   const nextClanLevel = studentClan.level + (value > 0 ? 1 : 0);
//   studentClan.gloryPoints += value;
//   if (value >= 0) {
//     // if it is an addition
//     if (studentClan.level === 5) {
//       return studentClan;
//     }
//     if (studentClan.gloryPoints >= ClanTresholds[nextClanLevel].treshold) {
//       studentClan.level++;
//     }
//   } else {
//     // if it is a substaction
//     if (studentClan.gloryPoints < 0) {
//       studentClan.gloryPoints = 0;
//     }
//     if (nextClanLevel === 1) {
//       return studentClan;
//     }
//     if (studentClan.gloryPoints < ClanTresholds[nextClanLevel].treshold) {
//       studentClan.level--;
//     }
//   }
//   return studentClan;
// }

// const getClanXpModifier = (clanLevel, isTest) => {
//   let modifier = ClanTresholds[clanLevel].xpModifierIncrease;
//   if (isTest) {
//     modifier += ClanTresholds[clanLevel].testXpModifierIncrease;
//   }
//   return modifier;
// }

// const countModifiedValue = (student, incomingValue, pointType, isDuel, clanLevel, isTest, pointModifier) => {
//   // TODO rethink unit tests
//   if (incomingValue < 0) {
//     let newValue = student[pointType] + incomingValue;
//     newValue = newValue < 0 ? 0 : newValue;
//     return parseFloat(newValue.toFixed(2));
//   }
//   let modifier = pointModifier;
//   if (pointType === StudProp.LESSON_XP) {
//     modifier += getClanXpModifier(clanLevel, isTest);
//     modifier += student.armour;
//   } else if (pointType === StudProp.MANA_POINTS) {
//     modifier += student.jewellery;
//   }

//   if (student.class === Classes.BARD && pointType === StudProp.MANA_POINTS) {
//     modifier += 10
//   }
//   if (modifier) {
//     incomingValue *= (100 + modifier) / 100;
//   }
//   if (student.class === Classes.WIZARD && isTest) {
//     incomingValue *= 2;
//   }
//   if (student.class === Classes.ADVENTURER && pointType === StudProp.PET_FOOD) {
//     incomingValue *= 2;
//   }
//   if (isDuel && student.class === Classes.WARRIOR && pointType === StudProp.LESSON_XP) {
//     incomingValue *= 2;
//   }
//   let newValue = student[pointType] + incomingValue;
//   // mana max value is 600, if it is over, it is set to 600
//   if (pointType === StudProp.MANA_POINTS && newValue > 600) {
//     newValue = 600;
//   }
//   // newValue = newValue < 0 ? 0 : newValue;
//   return parseFloat(newValue.toFixed(2));
// }

// const addValueToAllApi = async (data, userId) => {
//   const areInputWrong = areAddToAllValuesWrong(data);
//   if (areInputWrong) {
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   const realm = await RealmDoc.getById(data.realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const modifiedRealm = addValueToAll(realm, data);
//   const result = await RealmTransaction.saveRealm(modifiedRealm);
//   return result ? result : responseMessage.DATABASE.ERROR;
// }

// const areAddToAllValuesWrong = (data) => {
//   return (
//     !validIncomingPointTypes.includes(data.pointType) ||
//     typeof data.value !== 'number' ||
//     !Array.isArray(data.exclude)
//   )
// }

// const addValueToAll = (realm, data) => {
//   realm.students.forEach(student => {
//     if (data.exclude.includes(student._id.toString())) {
//       return;
//     }
//     const clanFortressLevel = getStudentClanFortressLevel(student.clan, realm.clans);
//     const clanLevel = getStudentClanLevel(student.clan, realm.clans);
//     const inputModifier = data.pointType === StudProp.MANA_POINTS ? clanFortressLevel * 5 : 0;
//     student[data.pointType] = countModifiedValue(
//       student,
//       data.value,
//       data.pointType,
//       false,
//       clanLevel,
//       false,
//       inputModifier
//     );
//   });
//   return realm;
// }

// const getStudentClanLevel = (studentClan, clans) => {
//   let clanLevel = 1;
//   const clan = findElemById(clans, studentClan);
//   if (clan) {
//     clanLevel = clan.level;
//   }
//   return clanLevel;
// }

// const addLessonXpToSumXpApi = async (realmId, userId) => {
//   const realm = await RealmDoc.getById(realmId);
//   const backup = await BackupDoc.getBackup();
  
//   if (
//     !realm || 
//     realm === responseMessage.DATABASE.ERROR ||
//     !backup ||
//     backup === responseMessage.DATABASE.ERROR
//   ) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }

//   addLessonXpToSumXp(realm.students);
//   checkStudentLevelUp(realm);

//   saveBackup(realm, backup);
//   const result = await RealmTransaction.saveRealmAndBackup(realm, backup);
//   if (result) {
//     SheetService.syncSheet(realm, realm.name, null);
//     return result;
//   }
//   return responseMessage.DATABASE.ERROR;
// };

// const addLessonXpToSumXp = (students) => {
//   students.forEach(student => {
//     student[StudProp.CUMULATIVE_XP] += student[StudProp.LESSON_XP];
//     student[StudProp.LESSON_XP] = 0;
//   });
//   return students;
// }

// const saveBackup = (realm, backup) => {
//   const newBackup = Backup({
//     data: realm,
//     time: new Date().getTime()
//   });
//   const realmBackup = backup.realms[realm._id.toString()];
//   if (realmBackup) {
//     realmBackup.list.push(newBackup);
//   } else {
//     backup.realms[realm._id.toString()] = {
//       list: [newBackup]
//     }
//   }
// }

// const checkStudentLevelUp = (realm) => {
//   realm.students.forEach(student => {
//     if (student.level === 8) {
//       return;
//     }
//     const nextLevel = student.level + 1;
//     const treshold = ClassesWithTresholds.tresholds[nextLevel];
//     if (student.cumulativeXp >= treshold) {
//       const prevLevel = student.level;
//       student.level++;
//       if (student.clan && prevLevel % 2 === 0) {
//         checkAllStudentInClanLevelUp(realm, student);
//       }
//     }
//   });
//   return realm;
// }

// const findElemById = (array, id) => {
//   if (!array || !array.length || !id) {
//     return null;
//   }
//   return array.find(e => e._id.toString() === id.toString());
// }

// const checkAllStudentInClanLevelUp = (realm, refStudent) => {
//   // TODO unit tests
//   const clan = findElemById(realm.clans, refStudent.clan);
//   let levelCounter = 0;
//   clan.students.forEach(studId => {
//     const student = findElemById(realm.students, studId);
//     if (student.level >= refStudent.level) {
//       levelCounter++;
//     }
//   });
//   if (clan.students.length === levelCounter) {
//     let pointsIncrease;
//     if (refStudent.level === 3) {
//       pointsIncrease = 30;
//     } else if (refStudent.level === 5) {
//       pointsIncrease = 50;
//     } else if (refStudent.level === 7) {
//       pointsIncrease = 100;
//     }
//     clan.gloryPoints += pointsIncrease;
//   }
//   return realm;
// }

// const getRealm = async (realmId, userId) => {
//   const realm = await RealmDoc.getById(realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const isCollaborator = isUserCollaborator(realm.collaborators, userId);
//   if (isCollaborator) {
//     return realm;
//   }
//   return responseMessage.REALM.NOT_AUTHORIZED;
// }

// const isUserCollaborator = (collaborators, userId) => {
//   for (const collaborator of collaborators) {
//     if (collaborator.toString() === userId.toString()) {
//       return true;
//     }
//   }
//   return false;
// }

// const getBackupData = async (realmId, userId) => {
//   const backup = await BackupDoc.getBackup();
//   const realm = await RealmDoc.getById(realmId);
//   if (!backup || backup === responseMessage.DATABASE.ERROR || !realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   let saveTimeList = [];
//   const realmBackup = backup.realms[realmId.toString()];
//   if (realmBackup) {
//     saveTimeList = realmBackup.list.map(elem => elem.time);
//   }
//   return saveTimeList;
// }

// const getRealms = async (userId) => {
//   const realms = await RealmDoc.getAll();
//   if (!realms || realms === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const userRealms = findUserRealms(realms, userId);
//   return userRealms;
// };

// const findUserRealms = (realms, userId) => {
//   const list = [];
//   realms.forEach(realm => {
//     for (const savedId of realm.collaborators) {
//       if (savedId.toString() === userId.toString()) {
//         list.push({
//           id: realm._id,
//           title: realm.name
//         });
//         break;
//       }
//     }
//   });
//   return list;
// }

// const getClasses = () => {
//   return ClassesWithTresholds.classes;
// };

// const createRealm = async (realmName, userId) => {
//   // TODO unique realm names ???
//   if (await SheetService.accessSpreadsheet(realmName)) {
//     return responseMessage.REALM.NAME_TAKEN;
//   }
//   const isSaveToDbSuccess = await createRealmToDb(realmName, userId);
//   if (isSaveToDbSuccess) {
//     return await getRealms(userId);
//   }
//   return responseMessage.REALM.CREATE_FAIL;
// }

// const areStudentsWrong = (realm, students) => {
//   if (!students || !students.length) {
//     return true;
//   }
//   const clanList = getRealmClans(realm);
//   const classes = Object.values(Classes);

//   for (let i = 0; i < students.length; i++) {
//     const student = students[i];
//     if (
//       !student.name ||
//       (student.class && !classes.includes(student.class)) ||
//       (clanList.length && student.clan && !clanList.includes(student.clan.toString()))
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// const getRealmStudentList = (students) => {
//   return students.map((student) => {
//     return student.name;
//   })
// }

// const addStudentsApi = async (realmId, students, userId) => {
//   const realm = await RealmDoc.getById(realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const studentsAreInvaild = areStudentsWrong(realm, students);
//   if (studentsAreInvaild) {
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   const result = addStudents(realm, students);
//   const freshStudents = result.studentList;
//   const registerTokens = createInviteLinkForStudents(freshStudents, realm._id.toString());

//   const savedRealm = await RealmTransaction.saveRealmAndRegisterTokens(realm, registerTokens);
//   return savedRealm ? savedRealm : responseMessage.DATABASE.ERROR;
// }

// const createInviteLinkForStudents = (freshStudents, realmId) => {
//   const registerTokens = [];
//   freshStudents.forEach(student => {
//     const regToken = RegisterToken({
//       role: Roles.STUDENT,
//       expiresAt: null,
//       studentData: {
//         realmId: realmId,
//         studentId: student._id.toString()
//       }
//     });
//     registerTokens.push(regToken);
//     student.inviteUrl = `${process.env.UI_BASE_URL}register/${regToken._id.toString()}`
//   });
//   return registerTokens;
// }

// const addStudents = (realm, students) => {
//   const savedStudents = getRealmStudentList(realm.students);
//   const studentList = [];
//   students.forEach(student => {
//     if (savedStudents.includes(student.name)) {
//       return;
//     }
//     studentList.push(Student({
//       [StudProp.NAME]: student.name,
//       [StudProp.CLASS]: student.class,
//       [StudProp.CLAN]: student.clan,
//       [StudProp.LEVEL]: 1,
//       [StudProp.CUMULATIVE_XP]: 0,
//       [StudProp.XP_MODIFIER]: 0,
//       [StudProp.LESSON_XP]: 0,
//       [StudProp.MANA_POINTS]: 0,
//       [StudProp.MANA_MODIFIER]: 0,
//       [StudProp.SKILL_COUNTER]: 0,
//       [StudProp.PET_FOOD]: 0,
//       [StudProp.CURSE_POINTS]: 0,
//       [StudProp.DUEL_COUNT]: 0,
//       weapon: 0,
//       shield: 0,
//       monsterHit: 0,
//       armour: 0,
//       jewellery: 0,
//       cloak: 0
//     }));
//     savedStudents.push(student.name);
//   })
//   // another loop is needed because in the firts user has no ID yet
//   studentList.forEach(student => {
//     if (student.clan) {
//       const savedClan = findElemById(realm.clans, student.clan);
//       savedClan.students.push(student._id)
//     }
//   })
//   realm.students.push(...studentList);
//   return { realm: realm, studentList: studentList };
// }

// const createRealmToDb = async (realmName, userId) => {
//   const newRealm = Realm({
//     name: realmName,
//     finishLessonMana: 0,
//     xpStep: 0,
//     manaStep: 0,
//     duelStep: 0,
//     rampageXp: 0,
//     owner: userId.toString(),
//     collaborators: [userId.toString()],
//     students: [],
//     clans: [],
//     monsters: Monsters
//   })
//   try {
//     await newRealm.save();
//     return true;
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// }

// const createClansApi = async (realmId, newClans, userId) => {
//   const realm = await RealmDoc.getById(realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!Array.isArray(newClans)) {
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   createClans(realm, newClans);
//   const result = await RealmTransaction.saveRealm(realm);
//   return result ? result : responseMessage.DATABASE.ERROR;
// }

// const getClanNames = (clans) => {
//   return clans.map(clan => clan.name);
// }

// const createClans = (realm, newClans) => {
//   const clanNames = getClanNames(realm.clans);
//   const newClanObjects = [];
//   newClans.forEach(clan => {
//     if (!clan.name || clanNames.includes(clan.name)) {
//       return;
//     }
//     newClanObjects.push(Clan({
//       name: clan.name,
//       gloryPoints: 0,
//       level: 1,
//       students: [],
//       fortress: 0,
//       army: 0
//     }));
//     clanNames.push(clan.name);
//   });
//   realm.clans.push(...newClanObjects);
//   return realm;
// }

// const resetRealmApi = async (realmId, userId) => {
//   const realm = await RealmDoc.getById(realmId);
//   const backup = await BackupDoc.getBackup();
//   if (!realm || realm === responseMessage.DATABASE.ERROR || !backup || backup === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   resetRealm(realm);
//   const realmBackup = backup.realms[realm._id.toString()];
//   realmBackup.list = [];
//   const result = await RealmTransaction.saveRealmAndBackup(realm, backup);
//   if (result) {
//     SheetService.syncSheet(realm, realm.name, null);
//     return result;
//   }
//   return responseMessage.DATABASE.ERROR;
// }

// const resetRealm = (realm) => {
//   realm.finishLessonMana = 0;
//   realm.xpStep = 0,
//   realm.manaStep = 0,
//   realm.duelStep = 0,
//   realm.rampageXp = 0,
//   realm.monsters = Monsters,
//   realm.clans = [];
//   realm.students.forEach(student => {
//     student[StudProp.CLASS] = null,
//     student[StudProp.CLAN] = null,
//     student[StudProp.LEVEL] = 1,
//     student[StudProp.CUMULATIVE_XP] = 0,
//     student[StudProp.XP_MODIFIER] = 0,
//     student[StudProp.LESSON_XP] = 0,
//     student[StudProp.MANA_POINTS] = 0,
//     student[StudProp.MANA_MODIFIER] = 0,
//     student[StudProp.SKILL_COUNTER] = 0,
//     student[StudProp.PET_FOOD] = 0,
//     student[StudProp.CURSE_POINTS] = 0,
//     student[StudProp.DUEL_COUNT] = 0,
//     student.weapon = 0,
//     student.shield = 0,
//     student.monsterHit = 0,
//     student.armour = 0,
//     student.jewellery = 0,
//     student.cloak = 0
//   });
//   return realm;
// }

// const addTestApi = async (realmId, points, userId) => {
//   // TODO check if points has duplicated IDs
//   const realm = await RealmDoc.getById(realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const studentIds = getStudentIds(realm.students);
//   const arePointsNotGood = arePointsWrong(studentIds, points);
//   if (arePointsNotGood) {
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   addTest(realm, points);
//   const result = await RealmTransaction.saveRealm(realm);
//   return result ? result : responseMessage.DATABASE.ERROR;
// }

// const getStudentIds = (students) => {
//   return students.map(student => student._id.toString());
// }

// const arePointsWrong = (studentIdList, points) => {
//   if (!points || !Array.isArray(points) || !points.length) {
//     return true;
//   }
//   for (let i = 0; i < points.length; i++) {
//     const point = points[i]
//     if (
//       !point.id ||
//       // check for no duplications ???
//       !studentIdList.includes(point.id) ||
//       typeof point.xp !== 'number' ||
//       typeof point.xpModifier !== 'number' ||
//       point.xp < 0 ||
//       point.xpModifier < 0
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// const addTest = (realm, points) => {
//   points.forEach(test => {
//     const student = findElemById(realm.students, test.id);
//     const clanLevel = getStudentClanLevel(student.clan, realm.clans);
//     student.lessonXp = countModifiedValue(
//       student,
//       test.xp,
//       StudProp.LESSON_XP,
//       false,
//       clanLevel,
//       true,
//       test.xpModifier
//     );
//   });
//   return realm;
// }

// const modifyClan = async (data, userId) => {
//   const realm = await RealmDoc.getById(data.realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const studentClan = findElemById(realm.clans, data.clanId);
//   const areDataWrong = areClanDataWrong(data);
//   if (!studentClan || areDataWrong) {
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   if (data.fortress > studentClan.fortress) {
//     data.gloryPoints += (data.fortress - studentClan.fortress) * 10;
//   }
//   if (data.army > studentClan.army) {
//     data.gloryPoints += (data.army - studentClan.army) * 10;
//   }
//   studentClan.fortress = data.fortress
//   studentClan.army = data.army
//   if (data.gloryPoints) {
//     const prevClanLevel = studentClan.level;
//     manageClanGloryPointsAndLevelUp(studentClan, data.gloryPoints);
//     handleClanLevelUpCloakChange(realm.students, studentClan, prevClanLevel);
//   }
//   const result = await RealmTransaction.saveRealm(realm);
//   return result ? result : responseMessage.DATABASE.ERROR;
// }

// const areClanDataWrong = (data) => {
//   return (
//     typeof data.gloryPoints !== 'number' ||
//     typeof data.fortress !== 'number' ||
//     typeof data.army !== 'number' ||
//     data.fortress < 0 ||
//     data.fortress > 4 ||
//     data.army < 0 ||
//     data.army > 4
//   )
// }

// const areStepsWrong = (lessonMana, xpStep, manaStep, duelStep, rampageXp) => {
//   return (
//     typeof lessonMana !== 'number' ||
//     typeof xpStep !== 'number' ||
//     typeof manaStep !== 'number' ||
//     typeof duelStep !== 'number' ||
//     typeof rampageXp !== 'number'
//   )
// }

// const setRealmDefaultSteps = async (realmId, lessonMana, xpStep, manaStep, duelStep, rampageXp, userId) => {
//   const realm = await RealmDoc.getById(realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const areStepsNotOk = areStepsWrong(lessonMana, xpStep, manaStep, duelStep, rampageXp);
//   if (areStepsNotOk) {
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   realm.finishLessonMana = lessonMana;
//   realm.xpStep = xpStep;
//   realm.manaStep = manaStep;
//   realm.duelStep = duelStep;
//   realm.rampageXp = rampageXp;

//   const result = await RealmTransaction.saveRealm(realm);
//   return result ? result : responseMessage.DATABASE.ERROR;
// }

// const saveModifiedStudentApi = async (modifiedStudent, userId) => {
//   const realm = await RealmDoc.getById(mongoose.Types.ObjectId(modifiedStudent.realmId));
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const student = findElemById(realm.students, modifiedStudent._id);
//   const areTypesWrong = areModifyStudentTypesWrong(realm, modifiedStudent);
//   const areStudentClansWrong = areClansWrong(realm, modifiedStudent.clan);
//   if (!student || areTypesWrong || areStudentClansWrong) {
//     // if the studentId is invalid and no student found, the function returns with common error
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   const gloryPointsPerStep = 5;
//   let gloryPoints = 0;
//   if (student.shield < modifiedStudent.shield) {
//     gloryPoints += (modifiedStudent.shield - student.shield) * gloryPointsPerStep;
//   }
//   if (student.weapon < modifiedStudent.weapon) {
//     gloryPoints += (modifiedStudent.weapon - student.weapon) * gloryPointsPerStep;
//   }
//   if (student.armour < modifiedStudent.armour) {
//     gloryPoints += (modifiedStudent.armour - student.armour) * gloryPointsPerStep;
//   }
//   if (student.jewellery < modifiedStudent.jewellery) {
//     gloryPoints += (modifiedStudent.jewellery - student.jewellery) * gloryPointsPerStep;
//   }
//   if (student.cloak < modifiedStudent.cloak) {
//     gloryPoints += (modifiedStudent.cloak - student.cloak) * gloryPointsPerStep;
//   }
//   setModifiedStudent(student, modifiedStudent);
//   setStudentClans(realm, student, modifiedStudent.clan);
//   studentClan = findElemById(realm.clans, student.clan);
//   if (gloryPoints && studentClan) {
//     const prevClanLevel = studentClan.level;
//     manageClanGloryPointsAndLevelUp(studentClan, gloryPoints);
//     handleClanLevelUpCloakChange(realm.students, studentClan, prevClanLevel);
//   }
//   const result = await RealmTransaction.saveRealm(realm);
//   return result ? result : responseMessage.DATABASE.ERROR;
// }

// const handleClanLevelUpCloakChange = (students, studentClan, prevClanLevel) => {
//   const level4Cloack = 1;
//   const level5Cloack = 2;
//   if (prevClanLevel < studentClan.level && studentClan.level >= 4) {
//     const addCloakValue = studentClan.level === 4 ? level4Cloack : level5Cloack;
//     students.forEach(student => {
//       if (student.clan && student.clan.toString() === studentClan._id.toString()) {
//         student.cloak += addCloakValue;
//       }
//     });
//   }
//   return students;
// }

// const setStudentClans = (realm, student, newClan) => {
//   if (!newClan) {
//     // student had no clan before and was not added this time either
//     return realm;
//   }
//   let prevClan;
//   if (student.clan) {
//     // try to find previous clan
//     prevClan = findElemById(realm.clans, student.clan);
//   }
//   // find current clan
//   const currentClan = findElemById(realm.clans, newClan);
//   // if the clan ID not changed, the function returns
//   if (prevClan && prevClan._id.toString() === currentClan._id.toString()) {
//     return realm;
//   }
//   // add student to clan students
//   currentClan.students.push(student._id);
//   // add clan to student
//   student.clan = currentClan._id;
//   if (!prevClan) {
//     // if no previous clan, no more changes
//     return realm;
//   }
//   // if there is a previous clan, student is removed from its students
//   for (let i = 0; i < prevClan.students.length; i++) {
//     if (prevClan.students[i].toString() === student._id.toString()) {
//       prevClan.students.splice(i, 1);
//       return realm;
//     }
//   }
// }

// const areClansWrong = (realm, newClan) => {
//   const clanList = getRealmClans(realm);
//   if (!newClan) {
//     return false;
//   }
//   return !clanList.includes(newClan.toString());
// }

// const getRealmClans = (realm) => {
//   const clanList = [];
//   realm.clans.forEach(clan => {
//     clanList.push(clan._id.toString());
//   });
//   return clanList;
// }

// const areModifyStudentTypesWrong = (realm, modifiedStudent) => {
//   const clanlist = getRealmClans(realm);
//   const classes = Object.values(Classes);
//   // input type check
//   return (
//     !modifiedStudent.name ||
//     (modifiedStudent.class && !classes.includes(modifiedStudent.class)) ||
//     (clanlist.length && modifiedStudent.clan && !clanlist.includes(modifiedStudent.clan.toString())) ||
//     typeof modifiedStudent.shield !== 'number' ||
//     typeof modifiedStudent.weapon !== 'number' ||
//     modifiedStudent.shield < 0 ||
//     modifiedStudent.weapon < 0 ||
//     typeof modifiedStudent.armour !== 'number' ||
//     typeof modifiedStudent.jewellery !== 'number' ||
//     modifiedStudent.armour < 0 ||
//     modifiedStudent.jewellery < 0 ||
//     typeof modifiedStudent.cloak !== 'number' ||
//     modifiedStudent.cloak < 0
//   );
// }

// const setModifiedStudent = (student, modifiedStudent) => {
//   student.name = modifiedStudent.name;
//   student.class = modifiedStudent.class;
//   student.shield = modifiedStudent.shield;
//   student.weapon = modifiedStudent.weapon;
//   student.armour = modifiedStudent.armour;
//   student.jewellery = modifiedStudent.jewellery;
//   student.cloak = modifiedStudent.cloak;
//   return student;
// }

// const getStudentData = async (userId) => {
//   const user = await GoogleUserDoc.getUserById(userId);
//   if (!user || user === responseMessage.DATABASE.ERROR || user.role !== Roles.STUDENT) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const realm = await RealmDoc.getById(user.studentData.realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const student = findElemById(realm.students, user.studentData.studentId);
//   if (!student) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const studentClan = findElemById(realm.clans, student.clan)
//   const clanMates = [];
//   if (studentClan) {
//     for (const id of studentClan.students) {
//       const mate = findElemById(realm.students, id);
//       if (mate.name !== student.name) {
//         clanMates.push(mate.name);
//       }
//     }
//   }
//   const studentData = {
//     name: student.name,
//     class: student.class,
//     cumulativeXp: student.cumulativeXp,
//     manaPoints: student.manaPoints,
//     cursePoints: student.cursePoints,
//     duelCount: student.duelCount,
//     level: student.level,
//     petFood: student.petFood,
//     skillUsed: student.skillUsed,
//     shield: student.shield,
//     weapon: student.weapon,
//     monsterHit: student.monsterHit,
//     armour: student.armour,
//     jewellery: student.jewellery,
//     cloak: student.cloak,
//     clanName: studentClan ? studentClan.name : null,
//     clanLevel: studentClan ? studentClan.level : null,
//     clanGloryPoints: studentClan ? studentClan.gloryPoints : null,
//     clanLevel: studentClan ? studentClan.level : null,
//     clanFortress: studentClan ? studentClan.fortress : null,
//     clanArmy: studentClan ? studentClan.army : null,
//     clanMates: clanMates
//   }
//   return studentData;
// }

// const createTeacherInvite = async () => {
//   const teackerTokens = await RegisterTokenDoc.getByRole(Roles.TEACHER);
//   if (!teackerTokens || teackerTokens === responseMessage.DATABASE.ERROR) {
//     responseMessage.DATABASE.ERROR;
//   }
//   // finds and deletes all expired tokens
//   const deadTokens = [];
//   const now = new Date().getTime();
//   teackerTokens.forEach(token => {
//     if (token.expiresAt < now) {
//       deadTokens.push(token);
//     }
//   });
//   if (deadTokens.length) {
//     await RegisterTokenDoc.removeTokens(deadTokens);
//   }
//   const teacherToken = createInviteLinkForTeacher();
//   const result = await RegisterTokenDoc.saveToken(teacherToken);
//   if (result) {
//     return `${process.env.UI_BASE_URL}register/${teacherToken._id.toString()}`
//   }
//   return responseMessage.DATABASE.ERROR;
// }

// const createInviteLinkForTeacher = () => {
//   const expires = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
//   const regToken = RegisterToken({
//     role: Roles.TEACHER,
//     expiresAt: expires,
//     studentData: null
//   });
//   return regToken;
// }

// const getPossibleCollaboratorsApi = async (realmId, userId) => {
//   const users = await GoogleUserDoc.getByRole(Roles.TEACHER);
//   const realm = await RealmDoc.getById(realmId);
//   if (!users || users === responseMessage.DATABASE.ERROR || !realm ||  realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const currentCollaborators = realm.collaborators.map(c => c.toString());
//   const collaborators = getPossibleCollaborators(users, currentCollaborators);
//   return collaborators;
// }

// const getPossibleCollaborators = (users, currentCollaborators) => {
//   const collaborators = users.map(user => {
//     return {
//       firstname: user.firstname,
//       lastname: user.lastname,
//       nickname: user.nickname,
//       id: user._id.toString()
//     }
//   }).filter((user => !currentCollaborators.includes(user.id)));
//   return collaborators;
// }

// const saveCollaboratorsApi = async (userId, data) => {
//   const realm = await RealmDoc.getById(data.realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (data.isAdd) {
//     data.collaborators.forEach(async (collaborator) => {
//       const user = await GoogleUserDoc.getUserById(collaborator);
//       if (user && user !== responseMessage.DATABASE.ERROR && user.role === Roles.TEACHER) {
//         for (const savedCollaborator of realm.collaborators) {
//           // if the user is alreasy added to collaborators, won't be added again
//           if (savedCollaborator.toString() === collaborator.toString()) {
//             return;
//           }
//         }
//         realm.collaborators.push(user._id);
//       }
//     });
//   } else {
//     saveCollaborators(realm, data.isAdd, data.collaborators);
//   }
//   const result = await RealmTransaction.saveRealm(realm);
//   return result ? result : responseMessage.DATABASE.ERROR;
// }

// const saveCollaborators = (realm, isAdd, collaborators) => {
//   if (isAdd) {
//     realm.collaborators.push(...collaborators);
//   } else {
//     collaborators.forEach(coll => {
//       for (let i = 0; i < realm.collaborators.length; i++) {
//         const savedColl = realm.collaborators[i];
//         if (savedColl.toString() === coll.toString()) {
//           realm.collaborators.splice(i, 1);
//           return;
//         }
//       }
//     });
//   }
//   return realm;
// }

// const getCollaboratorsApi = async (realmId, userId) => {
//   const realm = await RealmDoc.getById(realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const collaboratorsData = [];
//   for (const coll of realm.collaborators) {
//     const user = await GoogleUserDoc.getUserById(coll);
//     if (user._id.toString() !== userId.toString()) {
//       collaboratorsData.push({
//         firstname: user.firstname,
//         lastname: user.lastname,
//         nickname: user.nickname,
//         id: user._id
//       });
//     }
//   }
//   return collaboratorsData;
// }

// const modifyMonsterApi = async (userId, data) => {
//   const areDataWrong = areMonsterDataWrong(data);
//   if (areDataWrong) {
//     return responseMessage.COMMON.INVALID_DATA;
//   }
//   const realm = await RealmDoc.getById(data.realmId);
//   if (!realm || realm === responseMessage.DATABASE.ERROR) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   if (!isAuthorized(realm, userId)) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   let thrower = findElemById(realm[data.isStudent ? 'students' : 'clans'], data.throwerId);
//   if (!thrower) {
//     return responseMessage.DATABASE.ERROR;
//   }
//   const studentIds = data.isStudent ? [data.throwerId] : thrower.students;
//   updateMonsterHit(realm.students, studentIds, data.value);
//   modifyMonster(realm.monsters, data);
//   const result = await RealmTransaction.saveRealm(realm);
//   return result ? result : responseMessage.DATABASE.ERROR;
// }

// const updateMonsterHit = (students, studentIds, value) => {
//   studentIds.forEach(id => {
//     const student = findElemById(students, id);
//     if (!student) {
//       return;
//     }
//     if (!student.monsterHit) {
//       student.monsterHit = 0;
//     }
//     student.monsterHit += value;
//   });
//   return students;
// }

// const modifyMonster = (monsters, data) => {
//   let monster = monsters.find(monster => monster.level === data.level);
//   let diff;
//   if (monster.hp <= data.value) {
//     if (monster.hp < data.value) {
//       diff = data.value - monster.hp;
//     }
//     monster.hp = 0;
//   } else {
//     monster.hp -= data.value;
//   }
//   if (diff && data.level + 1 <= monsters.length) {
//     monster = monsters.find(monster => monster.level === data.level + 1);
//     monster.hp -= diff;
//   }
//   return monsters;
// }

// const areMonsterDataWrong = (data) => {
//   return (
//     typeof data.level !== 'number' ||
//     data.level < 1 ||
//     data.level > 4 ||
//     typeof data.value !== 'number' ||
//     data.value < 0 ||
//     typeof data.throwerId !== 'string' ||
//     typeof data.isStudent !== 'boolean'
//   )
// }

// module.exports = {
//   modifyMonster: modifyMonster,
//   areMonsterDataWrong: areMonsterDataWrong,
//   addLessonXpToSumXpApi: addLessonXpToSumXpApi,
//   addLessonXpToSumXp: addLessonXpToSumXp,
//   addValueApi: addValueApi,
//   getRealm: getRealm,
//   getRealms: getRealms,
//   addValueToAll: addValueToAll,
//   getClasses: getClasses,
//   createRealm: createRealm,
//   addStudents: addStudents,
//   createClans: createClans,
//   createClansApi: createClansApi,
//   getBackupData: getBackupData,
//   resetRealm: resetRealm,
//   addTest: addTest,
//   modifyClan: modifyClan,
//   setRealmDefaultSteps: setRealmDefaultSteps,
//   findElemById: findElemById,
//   getStudentClanLevel: getStudentClanLevel,
//   countModifiedValue: countModifiedValue,
//   addValue: addValue,
//   manageClanGloryPointsAndLevelUp: manageClanGloryPointsAndLevelUp,
//   addValueToAllApi: addValueToAllApi,
//   resetRealmApi: resetRealmApi,
//   saveModifiedStudentApi: saveModifiedStudentApi,
//   setModifiedStudent: setModifiedStudent,
//   areModifyStudentTypesWrong: areModifyStudentTypesWrong,
//   areClansWrong: areClansWrong,
//   setStudentClans: setStudentClans,
//   areAddValueTypesWrong: areAddValueTypesWrong,
//   areStudentsWrong: areStudentsWrong,
//   addStudentsApi: addStudentsApi,
//   areAddToAllValuesWrong: areAddToAllValuesWrong,
//   checkStudentLevelUp: checkStudentLevelUp,
//   checkAllStudentInClanLevelUp: checkAllStudentInClanLevelUp,
//   addTestApi: addTestApi,
//   arePointsWrong: arePointsWrong,
//   areStepsWrong: areStepsWrong,
//   isUserCollaborator: isUserCollaborator,
//   findUserRealms: findUserRealms,
//   getStudentData: getStudentData,
//   createTeacherInvite: createTeacherInvite,
//   getPossibleCollaborators: getPossibleCollaborators,
//   getPossibleCollaboratorsApi: getPossibleCollaboratorsApi,
//   saveCollaboratorsApi: saveCollaboratorsApi,
//   saveCollaborators: saveCollaborators,
//   getCollaboratorsApi: getCollaboratorsApi,
//   modifyMonsterApi: modifyMonsterApi,
//   areClanDataWrong: areClanDataWrong,
//   updateMonsterHit: updateMonsterHit,
//   handleClanLevelUpCloakChange: handleClanLevelUpCloakChange
// };

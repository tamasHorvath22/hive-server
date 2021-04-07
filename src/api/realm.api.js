const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const RealmService = require("../services/realm.service");

module.exports = function (app) {

  /* 
    request: 
    { 
      realmId: the id of the realm,
      studentId: the id of the student,
      pointType: the type of the value,
      value: data to add the current data,
      isDuel: true if value modification comes from a duel
      isWinner: if that was a duel, defines who the winner was
    }
  */
  app.post("/add-value", jsonParser, async (req, res) => {
    res.send(await RealmService.addValueApi(req.body, req.decoded.userId));
  });

  /* 
    request: 
    {
      realmId: the id of the realm,
      pointType: the type of the value,
      value: data to add the current data
      exclude: array of student Id strings, these students don't get points
    }
  */
  app.post("/add-value-to-all", jsonParser, async (req, res) => {
    res.send(await RealmService.addValueToAllApi(req.body, req.decoded.userId));
  });

  /* 
    request: 
    {
      realmName: the name of the realm
    }
  */
  app.post("/create-realm", jsonParser, async (req, res) => {
    res.send(await RealmService.createRealm(req.body.realmName, req.decoded.userId));
  });

  /* 
    request: 
    {
      realmId: the Id of the realm to reset
    }
  */
  app.post("/reset-realm", jsonParser, async (req, res) => {
    res.send(await RealmService.resetRealmApi(req.body.realmId, req.decoded.userId));
  });

  /* 
    request: 
    {
      realmId: the ID of realm
      students: the list of new students -> { name: student name, class: class, clan: clan }
    }
  */
  app.post("/add-students", jsonParser, async (req, res) => {
    res.send(await RealmService.addStudentsApi(req.body.realmId, req.body.students, req.decoded.userId));
  });

  /* 
    request: 
    {
      realmId: the ID of realm
      points: list of points objects { name, id, xp, grade, xpModifier }
    }
  */
  app.post("/add-test", jsonParser, async (req, res) => {
    res.send(await RealmService.addTestApi(req.body.realmId, req.body.points, req.decoded.userId));
  });

  /* 
    request: 
    {
      student: the modified student -> { 
        name, class, clan, realmId, _id (student ID), weapon, shield
      }
    }
  */
  app.post("/save-modified-student", jsonParser, async (req, res) => {
    res.send(await RealmService.saveModifiedStudentApi(req.body.student, req.decoded.userId));
  });

  /* 
    request: 
    {
      realmId: the ID of realm
      clans: the list of clan names
    }
  */
  app.post("/add-clans", jsonParser, async (req, res) => {
    res.send(await RealmService.createClansApi(req.body.realmId, req.body.clans, req.decoded.userId));
  });

  /* 
    request: 
    {
      realmId: the ID of realm
      clanId: the ID of clan,
      gloryPoints: the amount of glory points added
      fortress: level of fortress
      army: level of army
    }
  */
  app.post("/modify-clan", jsonParser, async (req, res) => {
    res.send(await RealmService.modifyClan(req.body, req.decoded.userId));
  });

  /* 
    request: 
    {
      realmId: the ID of the realm,
      lessonMana: the value of mana given after a lesson,
      xpStep: the value of XP added default,
      manaStep: the value of mana added default,
      duelStep: the value of XP added default for a duel
      rampageXp: the value of XP added default for a duel
    }
  */
  app.post("/set-realm-steps", jsonParser, async (req, res) => {
    res.send(await RealmService.setRealmDefaultSteps(
      req.body.realmId,
      req.body.lessonMana,
      req.body.xpStep,
      req.body.manaStep,
      req.body.duelStep,
      req.body.rampageXp,
      req.decoded.userId
    ));
  });

  /* 
    request: 
    { 
      realmId: the id of the realm
    }
  */
  app.post("/add-lesson-xp-to-cumulative-xp", jsonParser, async (req, res) => {
    res.send(await RealmService.addLessonXpToSumXpApi(req.body.realmId, req.decoded.userId));
  });

  app.get("/realms/:realmId", jsonParser, async (req, res) => {
    res.send(await RealmService.getRealm(req.params.realmId, req.decoded.userId));
  });

  app.get("/backup/:realmId", jsonParser, async (req, res) => {
    res.send(await RealmService.getBackupData(req.params.realmId, req.decoded.userId));
  });

  app.get("/realms", jsonParser, async (req, res) => {
    res.send(await RealmService.getRealms(req.decoded.userId));
  });

  app.get("/create-teacher-invite", jsonParser, async (req, res) => {
    res.send(await RealmService.createTeacherInvite());
  });

  /* 
    request: 
    { 
      realmId: the id of the realm
    }
  */
  app.post("/get-possible-collaborators", jsonParser, async (req, res) => {
    res.send(await RealmService.getPossibleCollaboratorsApi(req.body.realmId, req.decoded.userId));
  });

  /* 
    request: 
    { 
      realmId: the id of the realm
    }
  */
  app.post("/get-collaborators", jsonParser, async (req, res) => {
    res.send(await RealmService.getCollaboratorsApi(req.body.realmId, req.decoded.userId));
  });

  /*
    request: 
    { 
      realmId: the id of the realm
      collaborators: user IDs to add or remove
      isAdd: true if add, false if remove
    }
  */
  app.post("/save-collaborators", jsonParser, async (req, res) => {
    res.send(await RealmService.saveCollaboratorsApi(req.decoded.userId, req.body));
  });

  /*
    request: 
    { 
      realmId: the id of the realm
      level: the level of monster
      value: true HP value to add/substract
      throwerId: the ID of clan or student
      isStudent: boolean, if it is a clan, than false
    }
  */
  app.post("/modify-monster", jsonParser, async (req, res) => {
    res.send(await RealmService.modifyMonsterApi(req.decoded.userId, req.body));
  });

  app.get("/student-data", jsonParser, async (req, res) => {
    res.send(await RealmService.getStudentData(req.decoded.userId));
  });

  app.get("/classes", jsonParser, (req, res) => {
    res.send(RealmService.getClasses());
  });

};

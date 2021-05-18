const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const HiveService = require("../services/hive.service");

module.exports = function (app) {

  app.get("/apiary-data", jsonParser, async (req, res) => {
    res.send(await HiveService.getUserDataApi(req.decoded.userId));
  });

  app.get("/apiary-data/:apiaryId", jsonParser, async (req, res) => {
    res.send(await HiveService.getApiaryDataApi(req.params.apiaryId, req.decoded.userId));
  });

  /* 
    request: 
    { 
      name: the name of the apiary,
    }
  */
  app.post("/create-apiary", jsonParser, async (req, res) => {
    res.send(await HiveService.createApiaryApi(req.body.name, req.decoded.userId));
  });

  /* 
    request: 
    { 
      apiaryId: the name of the apiary,
    }
  */
  app.post("/create-invite-link", jsonParser, async (req, res) => {
    res.send(await HiveService.createInviteLink(req.body.apiaryId, req.decoded.userId));
  });

  /* 
    request: 
    { 
      apiaryId: the ID of the apiary
      siteId: the name of the selected site,
    }
  */
  app.post("/create-hive", jsonParser, async (req, res) => {
    res.send(await HiveService.createHiveApi(req.body, req.decoded.userId));
  });

  /* 
    request: 
    { 
      apiaryId: the ID of the apiary
      hiveId: the ID of the selected hive
      siteId: this ID of the selected site
    }
  */
    app.post("/update-hive", jsonParser, async (req, res) => {
      res.send(await HiveService.updateHiveApi(req.body, req.decoded.userId));
    });

  /* 
    request: 
    { 
      apiaryId: the ID of the apiary
      siteName: the name of the new site
    }
  */
  app.post("/add-site", jsonParser, async (req, res) => {
    res.send(await HiveService.addSite(req.body, req.decoded.userId));
  });



  // /* 
  //   request: 
  //   { 
  //     realmId: the id of the realm,
  //     studentId: the id of the student,
  //     pointType: the type of the value,
  //     value: data to add the current data,
  //     isDuel: true if value modification comes from a duel
  //     isWinner: if that was a duel, defines who the winner was
  //   }
  // */
  // app.post("/add-value", jsonParser, async (req, res) => {
  //   res.send(await RealmService.addValueApi(req.body, req.decoded.userId));
  // });


};

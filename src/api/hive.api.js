const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const HiveService = require("../services/hive.service");

module.exports = function (app) {

  app.get("/apiary-data", jsonParser, async (req, res) => {
    res.send(await HiveService.getUserDataApi(req.decoded.userId));
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

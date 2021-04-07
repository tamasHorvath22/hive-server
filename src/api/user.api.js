const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const UserService = require("../services/user.service");

module.exports = function (app) {

  app.post("/auth/google", jsonParser, async (req, res) => {
    res.send(await UserService.handleAuthUser(req.body));
  });

};

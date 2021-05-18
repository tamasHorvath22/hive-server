const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const UserService = require("../services/user.service");

module.exports = function (app) {

  app.post("/auth/google", jsonParser, async (req, res) => {
    res.send(await UserService.handleAuthUser(req.body));
  });

  app.post("/get-users-by-text", jsonParser, async (req, res) => {
    res.send(await UserService.getUsersContainingText(req.body.text, req.body.userId, req.body.apiaryId));
  });

  app.post("/invite-registered-user", jsonParser, async (req, res) => {
    res.send(await UserService.inviteRegisteredUser(req.body));
  });
  
};

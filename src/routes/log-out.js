const { removeSession } = require("../model/session");
// const { getUserByEmail } = require("../model/user");
// const { Layout } = require("../templates.js");



function post(req, res) {
  const sid = req.signedCookies.sid;
  removeSession(sid);
  res.clearCookie("sid");
  res.redirect("/");
}

module.exports = { post };


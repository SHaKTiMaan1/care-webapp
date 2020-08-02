const { route } = require("./cwcRoutes");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/loginOptions", (req, res) => {
  res.render("login/loginOptions.ejs");
});

router.get("tanishaTest", (req, res) => {
  res.render("");
});

router.get("/report", function (req, res) {
  res.render("Tanisha/report-portal.ejs");
});

module.exports = router;

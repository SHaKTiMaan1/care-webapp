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

module.exports = router;

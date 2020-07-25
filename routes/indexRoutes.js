const { route } = require("./cwcRoutes");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/loginOptions", (req, res) => {
  res.render("loginOptions.ejs");
});

router.get("/registerByAdminOptions", (req, res) => {
  res.render("registerByAdminOptions.ejs");
});

route.get("tanishaTest", (req, res) => {
  res.render("Tanisha/");
});

module.exports = router;

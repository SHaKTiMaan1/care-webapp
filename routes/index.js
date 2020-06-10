var express 	= require("express"),
    router  	= express.Router();
    

router.get("/", function(req, res){
    res.render("landing.ejs");
});
    

module.exports = router;
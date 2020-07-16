const router  	= require('express').Router();

router.get("/", (req,res) => {
    res.render('index.ejs');
});


router.get("/loginOptions", (req,res) => {
    res.render('loginOptions.ejs');
});

router.get("/registerByAdminOptions", (req,res) => {
    res.render('registerByAdminOptions.ejs');
});

module.exports = router;
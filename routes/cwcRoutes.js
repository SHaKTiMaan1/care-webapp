const router  	    = require('express').Router();
const CwcEmployee   = require('../models/cwcEmployee');
    
router.get("/cwc/dashboard/:employee_id", async function(req, res){
    
    const idToSearch = req.params.employee_id.substring(1);

    const employee = await CwcEmployee.findOne({employee_id : idToSearch});
    res.render("CWC/cwcdashboard-childRegistration.ejs", {employee:employee});
});



router.get('/addChild',function(req, res){
    res.render("CWC/addChild.ejs");
});


router.post('/addChild', function(req, res){
    
});


router.get('/registered/:id/:name',function(req, res){
   
});


router.get('/details',function(req, res){
       
});


module.exports = router;
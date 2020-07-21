const router  	    = require('express').Router();
const CwcEmployee   = require('../models/cwcEmployee');
    

router.get("/cwc/dashboard/:employee_id", async function(req, res){
    
    const idToSearch = req.params.employee_id.substring(1);

    const employee = await CwcEmployee.findOne({employee_id : idToSearch});
    console.log("Employee found in CWC Route :");
    console.log(employee);
    res.render("CWC/dashboardHome.ejs", {employee:employee});
});





router.get("/cwc/dashboard/childRegistration/:employee_id", async function(req, res){
    
    const idToSearch = req.params.employee_id.substring(1);

    const employee = await CwcEmployee.findOne({employee_id : idToSearch});
    res.render("CWC/cwcdashboard-childRegistration.ejs", {employee:employee});
});


router.post('/addChild', function(req, res){
    
});


router.get('/registered/:id/:name',function(req, res){
   
});


router.get('/details',function(req, res){
       
});


module.exports = router;
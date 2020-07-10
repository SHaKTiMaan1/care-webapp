const router  	    = require('express').Router();
const bcrypt        = require('bcryptjs');
const CciEmployee   = require('../models/cciEmployee');
const CwcEmployee   = require('../models/cwcEmployee');
const {loginValidation} = require('../validation');

router.get("/login/:category", (req,res) => {
    res.render("login.ejs",{category : req.params.category});
});

router.post("/login/cwcemployee", async (req, res) => {
        //VALIDATING THE INPUTS
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
     
    console.log('Validated login');
 
        //CHECKING IF USER ALREADY EXISTS
    const employee = await CwcEmployee.findOne({email : req.body.email});
    if(!employee) res.send("Employee doesn't exist");
 
    console.log('Found Employee ' + employee);
        //CHECKING IF PASSWORD IS CORRECT
    console.log(bcrypt.hash(req.body.password, bcrypt.genSalt(10)));

    const isPasswordValid = await bcrypt.compare(req.body.password, employee.password);
    
    console.log("isPasswordValid : " + isPasswordValid);
    if(isPasswordValid){
        res.render("CWC/cwclanding.ejs", {employee : employee});
    } else {
        res.send("Wrong Password !!");
    }
});

router.post("/login/cciemployee",async (req, res) => {
        //VALIDATING THE INPUTS
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    console.log('Validated login');

        //CHECKING IF USER ALREADY EXISTS
    const employee = await CciEmployee.findOne({email : req.body.email});
    if(!employee) res.send("Employee doesn't exist");

    console.log('Found Employee ' + employee);
        //CHECKING IF PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(req.body.password, employee.password);
    
    console.log("isPasswordValid : " + isPasswordValid);
    if(isPasswordValid){
        res.send("Logged In");
    } else {
        res.send("Wrong Password !!");
    }
});

router.post("/login/liason", (req, res) => {

});

router.post("/login/admin", (req, res) => {

});

module.exports = router;
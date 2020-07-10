const router  	    = require('express').Router();
const bcrypt        = require('bcryptjs');
const CciEmployee   = require('../models/cciEmployee');
const { registerValidation, loginValidation} = require('../validation');


router.get("/registerByAdmin/:category", (req,res) => {
    res.render("registerByAdmin.ejs", {category : req.params.category});
});

router.post("/registerByAdmin/cciemployee", async (req,res) => {
    
        //VALIDATING DATA BEFORE MAKING USER
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    console.log('Validated');
        //CHECKING IF USER ALREADY EXISTS
    const emailExists = await CciEmployee.findOne({email : req.body.email});
    if(emailExists) return res.status(400).send('Email Already Exists');
    
    console.log("Email doesn't already exist");
    
        //HASHING THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    console.log("Password hashed " + hashedPassword);

        //CREATING A NEW CCI EMPLOYEE
    const employee = new CciEmployee({
        name            :   req.body.name,
        contactNumber   :   req.body.contactNumber,
        email           :   req.body.email,
        employee_id     :   req.body.employee_id,
        password        :   hashedPassword
    });

    
    console.log("Employee Created " + employee);

    try{
        const savedEmployee = await employee.save();
        
        console.log("Employee saved " + savedEmployee);

        res.send("Registered");
    }catch(err){
        console.log("We got some error");
        res.send("There was error" + err);
    }
});



router.get("/login/:category", (req,res) => {
    res.render("login.ejs",{category : req.params.category});
});

router.post("/login/cwcemployee", (req, res) => {

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
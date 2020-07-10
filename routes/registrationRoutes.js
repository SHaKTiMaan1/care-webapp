const router  	    = require('express').Router();
const bcrypt        = require('bcryptjs');
const CciEmployee   = require('../models/cciEmployee');
const CwcEmployee   = require('../models/cwcEmployee');
const {registerValidationEmployee} = require('../validation');


router.get("/registerByAdmin/:category", (req,res) => {
    res.render("employeeRegistration.ejs", {category : req.params.category, registrationBy : 'registerByAdmin'});
});

router.get("/registerByCWC/cciEmployee", (req,res) => {
    res.render("employeeRegistration.ejs", {category : 'cciEmployee',registrationBy : 'registerByCWC'});
});


router.post("/registerByAdmin/cwcemployee", async (req,res) => {
    
    //VALIDATING DATA BEFORE MAKING USER
const {error} = registerValidationEmployee(req.body);
if(error) return res.status(400).send(error.details[0].message);

console.log('Validated');

    //CHECKING IF USER ALREADY EXISTS
const emailExists = await CwcEmployee.findOne({email : req.body.email});
if(emailExists) return res.status(400).send('Email Already Exists');

console.log("Email doesn't already exist");

    //HASHING THE PASSWORD
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);

console.log("Password hashed " + hashedPassword);

    //CREATING A NEW CWC EMPLOYEE
const employee = new CwcEmployee({
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


router.post("/registerByCWC/cciemployee", async (req,res) => { 
    
        //VALIDATING DATA BEFORE MAKING USER
    const {error} = registerValidationEmployee(req.body);
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



module.exports = router;
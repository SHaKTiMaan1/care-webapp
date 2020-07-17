var mongoose = require("mongoose");

var childSchema = new mongoose.Schema({
    firstName  : {
        type        : String,
    },
    middleName : {
        type        : String
    },
    lastName   : {
        type        : String
    },
    dateOfBirth : {
        type : Date
    },
    registrationDate : {
        type : Date         //The current registration date
    },
    child_id : {
        type : String
    },
    cci_id : {
        type : String       //cci_id from the cciSchema
    },
    cci_name    : {
        type : String       
    },
    cwc_id : {
        type : String       //cwc_id from the cwcSchema
    },
    gender      : {
        type : String
    },
    aadharNumber : {
        type : Number
    },
    casteCategory : {
        type : String
    },
    eligibilityStatus : {
        type : String
    },
    witness_id : {          //employee_id from the cwcEmployeeSchema
        type : String,      
    },
    guardian_id : [{
        type : String,      //guardian_id from the guardianSchema
    }]
});

module.exports = mongoose.model("Child", childSchema);


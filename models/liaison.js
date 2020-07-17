const mongoose = require('mongoose');

const liaisonSchema = new mongoose.Schema({
    liaison_id : {
        type        : String,
        required    : true
    },
    firstName  : {
        type        : String,
    },
    middleName : {
        type        : String
    },
    lastName   : {
        type        : String
    },
    contactNumber   : {
        type        : Number,
        min         : 1111111111,
        max         : 9999999999
    },
    email : {
        type        : String,
        required    : true,
        min         : 7,
        max         : 255
    },
    password : {
        type        : String,
        required    : true,
        max         : 1024,
        min         : 4
    },
    organisation : {
        type        : String
    }
});

module.exports = mongoose.model("Liaison", liaisonSchema)
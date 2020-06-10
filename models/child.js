var mongoose = require("mongoose");

var ChildSchema = new mongoose.Schema({
    name        : String,
    C_Id        : String,
    age         : Number,
    cci_name    : String,
    cci_id      : String,

    cci_address : {
                  address : String, 
                  district: String,
                  state: String
    },

    reg_date    : {type : Date},
    gender      : String,
    witness     : String
});

module.exports = mongoose.model("Child", ChildSchema);


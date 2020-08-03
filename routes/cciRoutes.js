const router = require("express").Router();
const CciEmployee =   require("../models/cciEmployee");
const Message = require("../models/messageSchema.js");
const Cci = require("../models/cci.js");


router.get('/cci/dashboard/:employee_id', async function(req, res){
  const employee = await CciEmployee.findOne({ employee_id: req.params.employee_id})
  const message = await Message.findOne({ cci_id: employee.cci_id });
  const cci = await Cci.findOne({ cci_id: employee.cci_id });

  if(message!=null){
    Message.find( { cci_id: employee.cci_id },{ _id: 0, Messages: 1 },function (err, message) {
      if(err){
        console.log(err);
      }
      else{
        var obj = JSON.parse(JSON.stringify(message));
        res.render("CCI/cciDashboardHome.ejs", {employee: employee,cci:cci, conversation: obj[0].Messages  })
      }

    })
  }
  else {
    console.log("There are no Messages for this CWC and CCI");
    Message.create(
      {
        cci_id: req.params.cci_id,
        cwc_id: cci.cwc_id,
      },
      function (err, done) {
        if (err) {
          console.log(err);
        } else {
          console.log(done);
          res.redirect(
            "/message/" + req.params.employee_id + "/" + req.params.cci_id
          );
        }
      }
    );
  }
})

module.exports = router;
const router = require("express").Router();
const Message = require("../models/messageSchema.js");
const Cci = require("../models/cci.js");
const CwcEmployee = require("../models/cwcEmployee");

router.get("/message/:employee_id/:cci_id", async function (req, res) {
  const cci = await Cci.findOne({ cci_id: req.params.cci_id });
  console.log(cci.cci_id);
  const cci_list = await Cci.find(
    { cwc_id: cci.cwc_id },
    { _id: 0, cci_name: 1, cci_id: 1 }
  );
  const employee = await CwcEmployee.findOne({
    employee_id: req.params.employee_id,
  });
  const message = await Message.findOne({ cci_id: req.params.cci_id });
  if (message != null) {
    Message.find(
      { cci_id: req.params.cci_id },
      { _id: 0, Messages: 1 },
      function (err, message) {
        if (err) {
          console.log(err);
        } else {
          var obj = JSON.parse(JSON.stringify(message));
          // console.log(obj);
          // res.send(obj);

          res.render("messageBox.ejs", {
            employee: employee,
            conversation: obj[0].Messages,
            cci: cci,
            cci_list: cci_list,
          });
        }
      }
    );
  } else {
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
});

router.post("/message/:employee_id/:cci_id", function (req, res) {
  var message = [
    {
      time: new Date(),
      sender: "cwc",
      employee_id: req.params.employee_id,
      subject: req.body.subject,
      description: req.body.description,
    },
  ];

  Message.findOneAndUpdate(
    {
      cci_id: req.params.cci_id,
    },
    {
      $push: { Messages: message },
    },
    { upsert: true, new: true },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.redirect(
          "/message/" + req.params.employee_id + "/" + req.params.cci_id
        );
      }
    }
  );
});

module.exports = router;

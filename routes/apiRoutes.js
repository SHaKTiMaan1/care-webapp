const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var request = require("request");
const CciEmployee = require("../models/cciEmployee");
const Cwc = require("../models/cwc");
const Cci = require("../models/cci");
const Child = require("../models/child");

router.post("/desktopLogin", async (req, res) => {
  const cci_employee = await CciEmployee.findOne(
    {
      email: req.body.email,
    },
    { firstName: 1, email: 1, password: 1, cci_id: 1, contactNumber: 1 }
  );

  //checking if Password is valid
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    cci_employee.password
  );
  console.log(cci_employee);
  console.log(isPasswordValid);

  dataForJwt = {
    name: cci_employee.firstName,
    email: cci_employee.email,
    cci_id: cci_employee.cci_id,
    number: cci_employee.contactNumber,
  };

  const child = await Child.find({ cci_id: cci_employee.cci_id });
  if (isPasswordValid) {
    jwt.sign(
      dataForJwt,
      process.env.SECRET_KEY,
      { expiresIn: "2d" },
      (err, token) => {
        const dataToSend = [token, child];
        console.log(dataToSend);
        res.json(dataToSend);
      }
    );
  } else {
    res.sendStatus(403);
  }
});

router.get("/childrenDataUpdate/:cci_id", verifyToken, async (req, res) => {
  const child = await Child.find({ cci_id: req.params.cci_id });
  jwt.verify(req.token, process.env.SECRET_KEY, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json(child);
    }
  });
});

router.post("/postAttendance/:email", async (req, res) => {
  const employee = await CciEmployee.findOne({ email: req.params.email });
  const cci = Cci.findOne({ cci_id: employee.cci_id });
  attendance = JSON.parse(JSON.stringify(req.body["attendance"]));
  inOutMovement = JSON.parse(JSON.stringify(req.body["inOutMovement"]));

  jwt.verify(req.token, process.env.SECRET_KEY, (err) => {
    if (err) {
      res.sendStatus(403);
    }
  });

  try {
    const result = await Cci.updateOne(
      { cci_id: employee.cci_id },
      {
        $push: {
          attendance: { $each: attendance },
          in_out_movement: { $each: inOutMovement },
        },
      }
    );
    res.send("Data Sent Sucessfully");
  } catch (err) {}
  console.log("Data Sent Sucessfully");
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    //Get Token from Array
    const bearerToken = bearer[1];
    req.token = bearerToken;

    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;

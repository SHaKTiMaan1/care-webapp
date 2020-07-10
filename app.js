const express       = require('express');
const mongoose      = require('mongoose');
const dotenv        = require('dotenv');
const bodyParser 	= require("body-parser");

    //IMPORTING ROUTES
const authRoutes    = require('./routes/auth');
const indexRoutes   = require('./routes/index');



const app = express();
dotenv.config();


    //DATABASE CONNECTION
mongoose.connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("We are connected to MongoDB");
  });


    //MIDDLEWARES
app.use(bodyParser.urlencoded({extended: true}));


    //ROUTE MIDDLEWARES
app.use(authRoutes);
app.use(indexRoutes);

app.listen(3000,() => console.log("Server says Hello!!"));
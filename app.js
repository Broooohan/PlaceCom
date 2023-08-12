const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const app = express();
const path = require('path');

dotenv.config({path:'./config.env'});
require('./db/connection');
app.use(express.json()); //middleware
app.use(require('./router/auth')); //middleware

app.use(express.static(path.join(__dirname,"./client/build")));

app.get('*', function (req,res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server is running");
});

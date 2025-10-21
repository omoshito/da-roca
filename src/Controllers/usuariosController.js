const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuairo");


require("dotenv").config();
const SECRET = process.env.SECRET 

as
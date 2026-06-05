const express = require('express')
const auth = express.Router();

const {register , login , logout , adminRegister} = require("../Controller/auth");
const {userMiddleware} = require("../Middleware/userMiddleware");
const {adminMiddleware} = require("../Middleware/adminMiddleware")

auth.post('/register',register);
auth.post('/login',login);
auth.post('/logout', userMiddleware ,logout);
auth.post('/admin/register',adminMiddleware,adminRegister);

module.exports = auth;
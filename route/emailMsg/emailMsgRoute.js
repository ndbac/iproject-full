const express = require("express");
const { sendEmailMsgCtrl } = require("../../controllers/emailMsg/emailMsg");

const emailMsgRoute = express.Router();

emailMsgRoute.post("/", sendEmailMsgCtrl);

module.exports = emailMsgRoute;

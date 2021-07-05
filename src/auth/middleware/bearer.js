'use strict';
const base64 = require('base-64');
const users = require('../models/users.js')

module.exports = async (req, res, next) => {

  try {
  if (!req.headers.authorization) { 
    next('Invalid Login'); 
    return;
  }

  const token = req.headers.authorization.split(' ');
  // console.log(token[0]);
  if (token[0] !== 'Bearer') {
    next('invalid auth headers!');
    return;
  }

    const validUser = await users.authenticateWithToken(token[1]);

    req.user = validUser;
    req.token = validUser.token;
    next();
  } catch (e) {
    // console.log(e);
    res.status(403).send('catch/Invalid Login');;
  }
}
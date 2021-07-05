'use strict';


const base64 = require('base-64');
const User = require('../models/users.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ');
  let encodedString = basic.pop();
  let decodedString = base64.decode(encodedString);
  let [username, password] = decodedString.split(':');
  if(basic[0] !== 'Basic'){
    next('invalid login / basic')
    return;
  }

  try {
    req.user = await User.authenticateBasic(username, password);
      next();
  } catch (e) {
    res.status(403).send('catch/Invalid Login');
  }

}

// module.exports = async (req, res, next) => {

//   if (!req.headers.authorization) { return _authError(); }

//   let basic = req.headers.authorization;
//   let [user, pass] = base64.decode(basic).split(':');

//   try {
//     req.user = await User.authenticateBasic(user, pass)
//     next();
//   } catch (e) {
//     res.status(403).send('Invalid Login');
//   }

// }
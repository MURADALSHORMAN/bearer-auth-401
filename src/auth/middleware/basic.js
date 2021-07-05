'use strict';


const base64 = require('base-64');
const User = require('../models/users.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ');
  // let encodedString = basic.pop();
  if(basic[0] !== 'Basic'){
    next('invalid login / basic')
    return;
  }
  let decodedString = base64.decode(basic[1]);
  let [username, password] = decodedString.split(':');

  try {
    req.user = await User.authenticateBasic(username, password);
      next();
  } catch (e) {
    res.status(403).send('catch/Invalid Login');
  }

}

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var bcrypt = require('bcrypt');

const User = require('../models/User');

async function getUser(req, res, next) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).send('Missing username or password');
    }

    res.user = await User.findOne({username: username});

    next(); 
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};

router.post('/signup', getUser, async function(req, res) {
  try {
    const user = res.user;
    const username = req.body.username;
    const password = req.body.password;

    if (user) {
      return res.status(409).send('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username: username,
      password: hashedPassword,
      salt: salt,
    });

    req.session.username = username;

    return res.status(201).send('User created');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
});

router.post('/login', getUser, async function(req, res) {
  try {
    const user = res.user;
    const username = req.body.username;
    const password = req.body.password;

    if (!user) {
      return res.status(404).send('User does not exist');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Incorrect password');
    }
    
    req.session.username = username;

    return res.status(200).send('Sucessfully logged in');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
});

router.delete('/logout', function(req, res) {
  try {
    req.session.destroy();
    return res.status(200).send('Sucessfully logged out');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

module.exports = router;
 
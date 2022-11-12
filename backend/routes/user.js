const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); //Pour s'inscrire
router.post('/login', userCtrl.login); //Pour se connecter

module.exports = router;
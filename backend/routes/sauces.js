const express = require('express');
const router = express.Router(); // Pour créer des routeurs séparés pour chaque route principale 

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');

router.get('/', auth, sauceCtrl.getAllSauce); //Pour afficher les sauces
router.post('/', auth, multer, sauceCtrl.createSauce); //Pour créer les sauces
router.get('/:id', auth, sauceCtrl.getOneSauce); //Pour afficher une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); //Pour modifier une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); //Pour supprimer une sauce
router.post('/:id/like', auth, sauceCtrl.likedSauce); //Pour liker une sauce

module.exports = router;
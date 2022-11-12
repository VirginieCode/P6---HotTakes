const mongoose = require('mongoose');

//Pour prevalider les informations avant leur enregistrement et ainsi eviter les erreurs pouvant être générer par mangoDB
const uniqueValidator = require('mongoose-unique-validator'); 

// Modèle de données d'un utlisateur

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //unique pour ne pas avoir 2 utilisateurs avec la même adresse email
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
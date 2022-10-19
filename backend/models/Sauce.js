const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufactured: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false, default:0 },
  dislikes: { type: Number, required: false, default:0},
  usersLiked: { type: Number, required: false,},
  usersDisliked: { type: Number, required: false },
});

module.exports = mongoose.model("Sauce", sauceSchema);

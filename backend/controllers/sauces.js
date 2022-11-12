const Sauce = require("../models/Sauce");
const fs = require("fs"); //file system, accès aux fonctions pour de modifier le système de fichiers et supprimer les fichiers

//Pour creer une sauce

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
//Pour afficher une sauce

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//Pour modifier une sauce

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

  //Pour supprimer une sauce

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

  //Pour afficher toutes les sauces

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

  //Pour liker et disliker une sauce

exports.likedSauce = (req, res, next) => {
  console.log("like");
  console.log(req.params);
  console.log(req.body);

  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => {
        res.status(201).json({ message: "Like  fonctionnel" });
      })
      .catch((error) => res.status(400).json(error));
  }
  if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId } }
    )
      .then(() => {
        res.status(201).json({ message: "Dislike  fonctionnel" });
      })
      .catch((error) => res.status(400).json(error));
  }

  if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id }).then((Sauce) => {
      if (Sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => {
            res.status(201).json({ message: "Like retiré" });
          })
          .catch((error) => res.status(400).json(error));
      }
    });
  }

  if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id }).then((Sauce) => {
      if (Sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() => {
            res.status(201).json({ message: "Dislike retiré" });
          })
          .catch((error) => res.status(400).json(error));
      }
    });
  }
};

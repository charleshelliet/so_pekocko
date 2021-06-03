const Sauce = require('../models/Sauce'); //import du modèle de données
const fs = require('fs'); //gestion des fichiers

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {res.status(200).json(sauce);})
        .catch((error) => {res.status(404).json({ error: error });
      }
    );
  };
  
//création d'une sauce + enregistrement image dans le dossier  
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  
      });
      sauce.save()
        .then(() => {
          res.status(201).json({ message: 'Nouvelle sauce piquante créée !' });
        })
        .catch((error) => {res.status(400).json({ error: error });
        });
  };

//modification sauce + écrasement photo dossier
exports.updateSauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? (Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    }
  ) : ( sauceObject = { ...req.body })
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({
      message: 'Sauce mise à jour !'
    }))
    .catch((error) => res.status(400).json({
      error
    }))
};

//supression sauce + image associée
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  //système de like des sauces
  exports.likeSauce = (req, res, next) => {  
    const like = req.body.like;
    const user = req.body.userId;
    const sauceId = req.params.id;
    if (like === 1) {
      Sauce.updateOne(
        { _id: sauceId },
        {
          $push: { usersLiked: user },
          $inc: { likes: +1 },
        }
      )
        .then(() => res.status(200).json({ message: "Like ajouté !" }))
        .catch((error) => res.status(400).json({ error }));
    }
    if (like === -1) {
      Sauce.updateOne(
        { _id: sauceId },
        {
          $push: { usersDisliked: user }, 
          $inc: { dislikes: +1 },
        }
      )
        .then(() => {
          res.status(200).json({ message: "Dislike ajouté !" });
        })
        .catch((error) => res.status(400).json({ error }));
    }
    if (like === 0) {
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(user)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $pull: { usersLiked: user }, 
                $inc: { likes: -1 },
              }
            )
              .then(() => res.status(200).json({ message: "Like retiré !" }))
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(user)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $pull: { usersDisliked: user }, 
                $inc: { dislikes: -1 },
              }
            )
              .then(() => res.status(200).json({ message: "Dislike retiré !" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
    }
  };

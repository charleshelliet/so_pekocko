const Sauce = require('../models/Sauce');

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
  
exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauce = new Sauce({
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        userId: req.body.userId
      });
      console.log(sauce);
      sauce.save()
        .then(() => {
          res.status(201).json({ message: 'Nouvelle sauce piquante créée !' });
        })
        .catch((error) => {res.status(400).json({ error: error });
        });
  };
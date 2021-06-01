const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

//fonction asynchrone de signup 
exports.signup = (req, res, next) => {
  //hachage du mot de passe
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      //enregistrement de nouveau user dans la bdd 
      user.save()
        .then(() => res.status(201).json({ message: 'Nouvel utilisateur enregistré !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }))
};

//fonction de login
exports.login = (req, res, next) => {
  //recherche utilisateur dans la bdd
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur introuvable' })
    }
    //comparaison des hach des mots de passe
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe erroné' })
        }
        res.status(200).json({
          //authentification réussie avec userId et encodage token
          userId: user._id,
          token: jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
          )
        })
      })
      .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};


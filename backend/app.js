const express = require('express'); //import framework express
const helmet = require("helmet"); //package sécurité
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require("express-rate-limit");

require('dotenv').config();

//import des routeurs
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//connexion API à la BDD (MongoDB via mongoose)
mongoose.connect('mongodb+srv://'+ process.env.DB_ID +'?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); //création application express

app.use(helmet());    

//middleware d'ajout de headers à l'objet response pour éviter les erreurs de CORS
app.use((req, res, next) => {
    //accès à notre API depuis n'importe quelle origine 
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    //ajout des headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //envoi des requêtes avec les méthodes mentionnées 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//transformation du corps de la requete en json
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10
});

app.use('/api/auth', apiLimiter, userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app; //export de l'app pour y accéder depuis les autres fichiers
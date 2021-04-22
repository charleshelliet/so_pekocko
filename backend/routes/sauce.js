const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');

//router.get('/', auth, sauceCtrl.sauceArray); 
//router.get('/:id', auth, sauceCtrl.sauceId); 
//router.post('/', auth, sauceCtrl.sauceSelection);
//router.put('/:id', auth, sauceCtrl.sauceUpdate);
//router.delete('/:id', auth, sauceCtrl.sauceDelete);
//router.post('/:id/like', auth, sauceCtrl.sauceLike);

module.exports = router;
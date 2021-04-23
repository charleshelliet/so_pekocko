const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');

router.get('/', auth, sauceCtrl.getAllSauces); 
router.get('/:id', auth, sauceCtrl.getOneSauce); 
router.post('/', auth, sauceCtrl.createSauce);
//router.put('/:id', auth, sauceCtrl.sauceUpdate);
//router.delete('/:id', auth, sauceCtrl.sauceDelete);
//router.post('/:id/like', auth, sauceCtrl.sauceLike);

module.exports = router;
const express = require('express');
const auth = require('../middlewares/auth.js');
const sharp = require('../middlewares/optimizeSize.js');
const multer = require('../middlewares/multer.js');
const bookCtrl = require('../controllers/book');
const router = express.Router();

router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/', bookCtrl.getAllStuff);
router.get('/:id', bookCtrl.getBookById);
router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.ratingBook);

module.exports = router;

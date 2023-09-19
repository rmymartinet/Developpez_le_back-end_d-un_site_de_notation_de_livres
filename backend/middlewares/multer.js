const multer = require('multer');

//Permet de définir les extensions des images acceptées
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .split(' ')
      .join('_')
      .replace(/\.jpeg|\.jpg|\.png/g, '_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
});

//Permet de stocker les images dans le dossier images
module.exports = multer({ storage: storage }).single('image');

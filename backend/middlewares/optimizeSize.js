const sharp = require('sharp');

//Permet de réduire la taille des images envoyées par l'utilisateur
const optimizeImageSize = async (req, res, next) => {
  try {
    if (req.file) {
      console.log(req.file.path);
      sharp(req.file.path)
        .resize({ height: 500 })
        .webp({ quality: 80 })
        .toFile(
          req.file.path.replace(/\.jpeg|\.jpg|\.png/g, '_') + 'thumbnail.webp'
        );
    }
    next();
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = optimizeImageSize;

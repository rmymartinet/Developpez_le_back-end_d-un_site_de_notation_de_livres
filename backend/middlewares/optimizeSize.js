const sharp = require('sharp');
const fs = require('fs').promises;

// Permet de réduire la taille des images envoyées par l'utilisateur
const optimizeImageSize = async (req, res, next) => {
  try {
    if (req.file) {
      const originalImagePath = req.file.path;

      // Réduit la taille de l'image et convertissez-la en WebP
      await sharp(originalImagePath)
        .resize({ height: 500 })
        .webp({ quality: 80 })
        .toFile(
          originalImagePath.replace(/\.jpeg|\.jpg|\.png/g, '_') +
            'thumbnail.webp'
        );

      // Supprime l'image originale
      await fs.unlink(originalImagePath);

      // Le chemin de l'image WebP est maintenant dans req.file.path
    }
    next();
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports = optimizeImageSize;

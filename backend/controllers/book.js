const Book = require('../models/Book');
const fs = require('fs/promises');

exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book); // On transforme l'objet JSON en objet JS
    delete bookObject._id; // On supprime l'id envoyé par le front pour éviter les doublons
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get(
        'host'
      )}/images/${req.file.filename.replace(
        /\.(jpeg|jpg|png)/g,
        '_'
      )}thumbnail.webp`,
    });

    await book.save();

    res.status(201).json({ message: 'Book saved!' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.modifyBook = async (req, res, next) => {
  try {
    const bookObject = req.file // Si req.file existe, on traite la nouvelle image
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get(
            'host'
          )}/images/${req.file.filename.replace(
            /\.(jpeg|jpg|png)/g,
            '_'
          )}thumbnail.webp`,
        }
      : { ...req.body }; // Si req.file n'existe pas, on traite simplement l'objet entrant

    delete bookObject._userId;

    const book = await Book.findOne({ _id: req.params.id }); // On récupère le livre à modifier

    if (book.userId != req.auth.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Si une nouvelle image est envoyée, on supprime l'ancienne
    if (bookObject.imageUrl) {
      const filenameThumb = book.imageUrl.split('/images/')[1];
      await fs.unlink(`images/${filenameThumb}`);
    }

    // On met à jour le livre
    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );
    res.status(200).json({ message: 'Book modified!' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (book.userId != req.auth.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Supprime l'image du livre
    const filenameThumb = book.imageUrl.split('/images/')[1];
    await fs.unlink(`images/${filenameThumb}`);

    // Supprime le livre
    await book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ error });
  }
};

exports.getAllStuff = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getBestRatedBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    books.sort((a, b) => b.averageRating - a.averageRating); // Trie les livres par note moyenne

    const bestRatedBooks = books.slice(0, 3).map((book) => ({
      ...book.toObject(),
      averageRating: parseFloat(book.averageRating.toFixed(1)),
    })); // Récupère les 3 premiers livres

    return res.status(201).json(bestRatedBooks);
  } catch (error) {
    return res.status(404).json({ error });
  }
};

exports.ratingBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    const isAlreadyRated = book.ratings.find(
      (rating) => rating.userId === req.auth.userId
    );

    const userRating = req.body.rating;

    // Vérifie que la note est entre 0 et 5
    if (userRating < 0 || userRating > 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be between 0 and 5' });
    }

    if (!isAlreadyRated) {
      book.ratings.push({
        userId: req.auth.userId,
        grade: req.body.rating,
      });

      let newAverageRating =
        book.ratings.reduce(
          (accumulator, currentValue) => accumulator + currentValue.grade,
          0
        ) / book.ratings.length;

      newAverageRating = Math.round(newAverageRating); // Arrondi la note moyenne

      book.averageRating = newAverageRating;
      await book.save();
      return res.status(201).json(book);
    } else {
      return res.status(401).json({ message: 'Book already rated' });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const app = express();
require('./db/mongo');
require('dotenv').config();

//Helmet permet de sécuriser les en-têtes HTTP
const helmet = require('helmet');
app.use(helmet());

//middleware appliqué à toutes les routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
});

app.use(express.urlencoded({ extended: true })); //Permet de parser les requêtes envoyées par le client
app.use(express.json());

//Permet de remplacer les caractères interdits par des _ dans les requêtes envoyées à la base de données
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

//Permet de servir les images statiques contenues dans le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

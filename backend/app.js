const express = require('express');
const app = express();
const path = require('path');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { appLimiter } = require('./middlewares/rateLimit');
require('./db/mongo');
require('dotenv').config();

// Middleware de sécurité
app.use(helmet());

// Middleware de taux de limite d'accès global
app.use(appLimiter);

// Middleware pour gérer les en-têtes CORS
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
  next();
});

// Middleware pour analyser le corps de la requête
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware pour servir les images statiques
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);

//Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Middleware de gestion des erreurs
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

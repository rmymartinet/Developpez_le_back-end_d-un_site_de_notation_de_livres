const mongoose = require('mongoose');

const DB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_DOMAIN}`;

async function connect() {
  try {
    await mongoose
      .connect(DB_URL)
      .then(() => console.log('Connexion à MongoDB réussie !'))
      .catch(() => console.log('Connexion à MongoDB échouée !'));
  } catch (e) {
    console.error(e);
  }
}
connect();

module.exports = mongoose;

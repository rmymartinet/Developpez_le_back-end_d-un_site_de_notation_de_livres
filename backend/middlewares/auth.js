const jwt = require('jsonwebtoken');

//Permet de vérifier que l'utilisateur est bien authentifié
module.exports = (req, res, next) => {
  try {
    //Récupération du token dans le header de la requête
    const token = req.headers.authorization.split(' ')[1];
    //Vérification du token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Récupération de l'userId
    const userId = decodedToken.userId;
    //Vérification que l'userId correspond à celui de la requête
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

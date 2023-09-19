// Ce module sert à valider les données entrées par l'utilisateur avant de les envoyer à la base de données.
module.exports = (validator) => {
  return (req, res, next) => {
    try {
      const { error } = validator(req.body);
      if (error) {
        return res
          .status(400)
          .send(
            error.details[0].message +
              '. Your password must contain at least one uppercase, lowercase, number and special character'
          );
      }
      next();
    } catch (err) {
      return res.status(400).send(err);
    }
  };
};

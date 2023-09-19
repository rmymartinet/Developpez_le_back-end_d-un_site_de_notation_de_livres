const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Joi = require('joi');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, trim: true, minlength: 8 },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('user', userSchema);

//validation des données entrées par l'utilisateur
const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(500).required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      .required()
      .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,1024}$/),
  });
  return schema.validate(user);
};

module.exports = {
  User,
  validateUser,
};

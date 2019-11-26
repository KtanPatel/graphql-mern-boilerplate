const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const profileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  gender: String,
  picture: String
})

const schema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile: {
    type: profileSchema,
    required: false
  },
  role: { type: String, default: 'user' },
  emailVerified: { type: Boolean }
}, { timestamps: true, versionKey: false });

// Create password hash middleware
schema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

// helper method to validate password
schema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', schema);

module.exports = User;



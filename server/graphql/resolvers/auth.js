const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async (args) => {
    try {
      const user = new User({
        email: args.user.email,
        password: args.user.password,
        role: args.user.role,
      });

      const existingUser = await User.findOne({ email: args.user.email });
      if (existingUser) {
        return { success: false, message: 'Account with that email address already exists.' };
      }

      const userResp = await user.save();
      if (userResp) {
        return { success: true, message: 'User Registered Successfully' }
      }

    } catch (error) {
      console.log('Err=>', error);
      return { success: false, message: error.message };
    }
  },
  login: async (args) => {
    try {

      const { email, password } = args;

      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("We are not aware of this user.");
        error.statusCode = 403
        throw error;
      }

      console.log(' compare pwd=> ', await user.comparePassword(password));
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const accessToken = jwt.sign({ _id: user._id, email: user.email },
          global.gConfig.JWT_secret,
          { expiresIn: global.gConfig.JWT_expiry });
        const refreshToken = jwt.sign({ _id: user._id },
          global.gConfig.JWT_secret,
          { expiresIn: '15m' });
        return {
          success: true, message: 'Success! You are logged in.',
          data: { accessToken, refreshToken }
        };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    }
    catch (error) {
      return { success: false, message: error.message };
    }
  }
}
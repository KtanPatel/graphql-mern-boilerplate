const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.authorization = (roles) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.data.role)) {
        throw new Error("You are not authorized to perform this operation");
      }
      next();
    } catch (error) {
      res.status(401).send({
        success: false,
        message: error.message
      })
    }
  }
}

exports.authentication = async (req, res, next) => {
  try {
    var accessToken = req.headers["authorization"];
    if (!accessToken) {
      req.isAuth = false;
    } else {
      accessToken = accessToken.replace('Bearer ', '');
      var jwtDecodeToken = jwt.decode(accessToken);
      if (!jwtDecodeToken) {
        req.isAuth = false;
      } else {
        var user = await User.findOne({
          email: jwtDecodeToken.email
        });
        if (!user) {
          req.isAuth = false;
        } else {
          try {
            jwt.verify(accessToken, global.gConfig.JWT_secret);
            var userData = user.toObject();
            delete userData.password;
            req.data = {
              ...userData
            }
            req.isAuth = true;
          } catch (error) {
            req.isAuth = false;
          }
        }
      }
    }
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message
    })
  }
}
const authResolver = require('./auth');
const userResolver = require('./user');

const rootResolver = {
  ...authResolver,
  ...userResolver
}

module.exports = rootResolver
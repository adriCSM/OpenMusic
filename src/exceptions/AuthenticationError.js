const ClientError = require('./ClientEroor');

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AthenticationError';
  }
}

module.exports = AuthenticationError;

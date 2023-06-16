const InvariantError = require('../../exceptions/InvariantError');
const { PostAuthenticationPaylodSchema, PutAuthenticationPaylodaSchema, DeleteAuthenticationPaylodaSchema } = require('./schema');

const AuthenticationValidators = {
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationPaylodSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationPaylodaSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult = DeleteAuthenticationPaylodaSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidators;

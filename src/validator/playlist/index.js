const InvariantError = require('../../exceptions/InvariantError');
const { PostPlaylistPaylodaSchema, PostSongInPlaylistPaylodaSchema } = require('./schema');

const PlaylistValidators = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPaylodaSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostSongInPlaylistPayload: (payload) => {
    const validationResult = PostSongInPlaylistPaylodaSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidators;

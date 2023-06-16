const Joi = require('joi');

const PostPlaylistPaylodaSchema = Joi.object({
  name: Joi.string().required(),
});
const PostSongInPlaylistPaylodaSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistPaylodaSchema,
  PostSongInPlaylistPaylodaSchema,
};

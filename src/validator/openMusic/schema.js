const Joi = require('joi');

// ---------------------------------------Schema Album & Song
const currentYear = new Date().getFullYear();
const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear).required(),
});
const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});
// ---------------------------------------Schema User & Authentications
const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});
const PostAuthenticationPaylodSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
const PutAuthenticationPaylodaSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
const DeleteAuthenticationPaylodaSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// ---------------------------------------Schema Song Playlist

const PostPlaylistPaylodaSchema = Joi.object({
  name: Joi.string().required(),
});
const PostSongInPlaylistPaylodaSchema = Joi.object({
  songId: Joi.string().required(),
});

// ---------------------------------------Schema Collaboration
const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  AlbumPayloadSchema,
  SongPayloadSchema,
  UserPayloadSchema,
  PostAuthenticationPaylodSchema,
  PutAuthenticationPaylodaSchema,
  DeleteAuthenticationPaylodaSchema,
  PostPlaylistPaylodaSchema,
  PostSongInPlaylistPaylodaSchema,
  CollaborationPayloadSchema,
};

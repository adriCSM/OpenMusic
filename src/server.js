const Hapi = require('@hapi/hapi');
require('dotenv').config();
const Jwt = require('@hapi/jwt');
// Albums & Songs
const albums = require('./api/albums');
const AlbumsService = require('./service/postgres/albumsService');
const songs = require('./api/songs');
const SongsService = require('./service/postgres/songsService');

// Users & Authentications
const users = require('./api/users');
const UsersService = require('./service/postgres/usersService');
const authentications = require('./api/authentications');
const AuthenticationsService = require('./service/postgres/authenticationsService');
const TokenManager = require('./tokenize/tokenManager');

// playlist
const playlists = require('./api/playlists');
const PlaylistsService = require('./service/postgres/playlistsService');
// Open Music Validator
const OpenMusicValidator = require('./validator/openMusic');
const errorHandling = require('./error handling/errorHandling');

const init = async () => {
  const authenticationsService = new AuthenticationsService();
  const usersService = new UsersService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const playlistsService = new PlaylistsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openMusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: OpenMusicValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: OpenMusicValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: OpenMusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: OpenMusicValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: OpenMusicValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => errorHandling(request, h));

  await server.start().then(() => {
    console.log('Server running at ' + server.info.uri);
  });
};

init();

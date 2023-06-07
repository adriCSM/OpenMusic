const Hapi = require('@hapi/hapi');
require('dotenv').config();
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsService = require('./service/postgres/albumService');
const SongsService = require('./service/postgres/songsService');
const OpenMusicValidator = require('./validator/openMusic');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
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
  ]);

  await server.start().then(() => {
    console.log('Server running at ' + server.info.uri);
  });
};

init();

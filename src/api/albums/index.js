const routes = require('./routes');
const AlbumHandlers = require('./handler');
module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, songsService, validator }) => {
    const albumsHandlers = new AlbumHandlers(service, songsService, validator);
    server.route(routes(albumsHandlers));
  },
};

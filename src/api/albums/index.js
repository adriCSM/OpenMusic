const routes = require('./routes');
const AlbumHandlers = require('./handler');
module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandlers = new AlbumHandlers(service, validator);
    server.route(routes(albumsHandlers));
  },
};

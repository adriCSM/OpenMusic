const routes = require('./routes');
const AlbumHandler = require('./handler');
module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumHandler(service, validator);
    server.route(routes(albumsHandler));
  },
};

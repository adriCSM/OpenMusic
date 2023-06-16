const routes = require('./routes');
const AlbumLikeHandlers = require('./handler');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { albumLikesService }) => {
    const albumsHandlers = new AlbumLikeHandlers(albumLikesService);
    server.route(routes(albumsHandlers));
  },
};

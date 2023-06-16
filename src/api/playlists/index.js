const routes = require('./routes');
const PlaylistHandlers = require('./handler');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistHandlers = new PlaylistHandlers(service, validator);
    await server.route(routes(playlistHandlers));
  },
};

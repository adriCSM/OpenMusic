const routes = require('./routes');
const SongHandlers = require('./handler');
module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songHandlers = new SongHandlers(service, validator);
    await server.route(routes(songHandlers));
  },
};

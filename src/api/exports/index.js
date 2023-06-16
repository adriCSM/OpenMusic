const ExportPlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { ProducerService, playlistsService, validator }) => {
    const exportPlaylistshandler = new ExportPlaylistsHandler(ProducerService, playlistsService, validator);

    await server.route(routes(exportPlaylistshandler));
  },
};

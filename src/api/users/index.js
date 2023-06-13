const routes = require('./routes');
const UserHandlers = require('./handler');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const userHandlers = new UserHandlers(service, validator);
    await server.route(routes(userHandlers));
  },
};

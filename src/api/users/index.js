const routes = require('./routes');
const UserHandlers = require('./handler');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, UserValidator, CollaborationValidator }) => {
    const userHandlers = new UserHandlers(service, UserValidator, CollaborationValidator);
    await server.route(routes(userHandlers));
  },
};

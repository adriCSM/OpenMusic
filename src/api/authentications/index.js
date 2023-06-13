const AuthenticationHandlers = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { authenticationsService, usersService, tokenManager, validator }) => {
    const authenticationHandlers = new AuthenticationHandlers(authenticationsService, usersService, tokenManager, validator);

    await server.route(routes(authenticationHandlers));
  },
};

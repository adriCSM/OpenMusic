const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h),
  },
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollaboratorHandler(request, h),
    options: {
      auth: 'openMusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handler.deleteCollaboratorHandler(request, h),
    options: {
      auth: 'openMusic_jwt',
    },
  },
];
module.exports = routes;

class UserHandlers {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }
  async postUserHandler(request, h) {
    this.validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this.service.postUser(username, password, fullname);

    const response = h.response({
      status: 'success',
      data: { userId },
    });
    response.code(201);
    return response;
  }

  async postCollaboratorHandler(request, h) {
    this.validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: crederntialId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(playlistId, crederntialId);
    const collaborationId = await this.service.postCollaborator(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaboratorHandler(request, h) {
    const { playlistId, userId } = request.payload;
    const { id: crederntialId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(playlistId, crederntialId);
    await this.service.deleteCollaborator(playlistId, userId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus collaborations',
    });
    response.code(200);
    return response;
  }
}

module.exports = UserHandlers;

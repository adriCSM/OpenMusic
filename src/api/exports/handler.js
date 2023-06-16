class ExportPlaylistsHandler {
  constructor(ProducerService, playlistsSrvice, validator) {
    this.ProducerService = ProducerService;
    this.validator = validator;
    this.playlistsSrvice = playlistsSrvice;
  }

  async postExportPlaylistsHandler(request, h) {
    this.validator.validateExportPlaylistsPayload(request.payload);
    const message = {
      userId: request.auth.credentials.id,
      playlistId: request.params.playlistId,
      targetEmail: request.payload.targetEmail,
    };
    await this.playlistsSrvice.verifyPlaylistOwner(message.playlistId, message.userId);
    await this.ProducerService.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });

    response.code(201);
    return response;
  }
}
module.exports = ExportPlaylistsHandler;

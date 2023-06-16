class UploadHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postCoverAlbumHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    this.validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this.service.writeFile(cover, cover.hapi);
    await this.service.updateAlbum(albumId, filename);
    this.service.deleteFile();
    return h
      .response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      })
      .code(201);
  }
}
module.exports = UploadHandler;

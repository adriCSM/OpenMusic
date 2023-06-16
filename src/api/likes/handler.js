class AlbumLikesHandler {
  constructor(albumLikesService) {
    this.albumLikesService = albumLikesService;
  }

  async postAlbumLikesHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;
    await this.albumLikesService.postLike(userId, albumId);
    return h
      .response({
        status: 'success',
        message: 'Berhasil menambahkan like',
      })
      .code(201);
  }

  async deleteAlbumLikesHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;
    await this.albumLikesService.deleteLike(userId, albumId);
    return h
      .response({
        status: 'success',
        message: 'Berhasil menghapus like',
      })
      .code(200);
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, fromCache } = await this.albumLikesService.getLike(albumId);
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);
    return fromCache ? response.header('X-Data-Source', 'cache') : response;
  }
}

module.exports = AlbumLikesHandler;

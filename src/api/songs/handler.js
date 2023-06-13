class SongHandlers {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  // POST SONG
  async postSongHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const { title, year, genre, performer, duration = undefined, albumId = undefined } = request.payload;
    const songId = await this.service.postSong({ title, year, genre, performer, duration, albumId });
    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  // GET SONGS
  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this.service.getSongs({ title, performer });
    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  // GET SONG BY ID
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this.service.getSongById(id);
    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  // PUT SONG BY ID
  async putSongByIdHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const { title, year, genre, performer, duration } = request.payload;
    await this.service.putSongById(id, { title, year, genre, performer, duration });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil diperbarui ',
    });
    response.code(200);
    return response;
  }

  // DELETE SONG BY ID
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this.service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongHandlers;

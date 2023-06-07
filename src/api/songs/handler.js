const ClientError = require('../../exceptions/ClientEroor');

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  // POST SONG
  async postSongHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Server error',
      });
      response.code(500);
      console.log('POST SONG: ' + error.message);
      return response;
    }
  }

  // GET SONGS
  async getSongsHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Server error',
      });
      response.code(500);
      console.log('GET SONGS: ' + error.message);
      return response;
    }
  }

  // GET SONG BY ID
  async getSongByIdHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Server error',
      });
      response.code(500);
      console.log('GET SONG BY ID: ' + error.message);
      return response;
    }
  }

  // PUT SONG BY ID
  async putSongByIdHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Server error',
      });
      response.code(500);
      console.log('PUT SONG BY ID: ' + error.message);
      return response;
    }
  }

  // DELETE SONG BY ID
  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this.service.deleteSongById(id);
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Server error',
      });
      response.code(500);
      console.log('DELETE SONG BY ID: ' + error.message);
      return response;
    }
  }
}

module.exports = SongsHandler;

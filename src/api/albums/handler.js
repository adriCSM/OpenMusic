const ClientError = require('../../exceptions/ClientEroor');

class AlbumHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }
  // POST ALBUM
  async postAlbumHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this.service.postAlbum({ name, year });
      const response = h.response({
        status: 'success',
        data: {
          albumId,
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
        message: error.message,
      });
      response.code(500);
      console.log('POST ALBUM: ' + error.message);
      return response;
    }
  }

  // GET ALBUM BY ID
  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this.service.getAlbumById(id);
      const response = h.response({
        status: 'success',
        data: {
          album,
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
        message: 'server error',
      });
      response.code(500);
      console.log('GET ALBUM BY ID: ' + error.message);
      return response;
    }
  }

  // PUT ALBUM BY ID
  async putAlbumByIdHandler(request, h) {
    try {
      this.validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      const { name, year } = request.payload;

      await this.service.putAlbumById(id, { name, year });
      const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbarui',
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
        message: 'server error',
      });
      response.code(500);
      console.log('PUT ALBUM BY ID: ' + error.message);
      return response;
    }
  }

  // DELETE ALBUM BY ID
  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this.service.deleteAlbumById(id);
      const response = h.response({
        status: 'success',
        message: 'Album berhasil dihapus',
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
        message: 'server error',
      });
      response.code(500);
      console.log('DELETE ALBUM BY ID: ' + error.message);
      return response;
    }
  }
}

module.exports = AlbumHandler;

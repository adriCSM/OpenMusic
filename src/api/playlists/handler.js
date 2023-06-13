class PlaylistHandlers {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }
  // ------------------------------------Playlist
  async postPlaylistHandler(request, h) {
    this.validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this.service.postPlaylist(name, credentialId);
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }
  async getPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.service.getPlaylist(credentialId);
    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  }
  async deletePlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(id, credentialId);
    await this.service.deletePlaylist(id);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus playlist',
    });
    response.code(200);
    return response;
  }
  // ====================================================Playlist_Songs
  async postSongInPlaylistHandler(request, h) {
    this.validator.validatePostSongInPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistAccess(id, credentialId);
    await this.service.postSongInPlaylist(songId, id);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistAccess(id, credentialId);
    const playlist = await this.service.getSongsInPlaylist(id);
    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongInPlaylistHandler(request, h) {
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistAccess(id, credentialId);
    await this.service.deleteSongInPlaylist(id, songId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus lagu dalam playlist',
    });
    response.code(200);
    return response;
  }
  // ====================================================Playlist Activities
  async getPlaylistActivitiesHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistAccess(id, credentialId);
    const activities = await this.service.getPlaylistActivities(id);
    const response = h.response({
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistHandlers;

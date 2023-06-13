const routes = (handler) => [
  // ------------------------------------Playlist
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: 'openMusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getPlaylistHandler(request, h),
    options: {
      auth: 'openMusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request, h) => handler.deletePlaylistHandler(request, h),
    options: {
      auth: 'openMusic_jwt',
    },
  },

  // ====================================================Playlist_Songs
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.postSongInPlaylistHandler(request, h),
    options: {
      auth: 'openMusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getSongsInPlaylistHandler(request, h),
    options: {
      auth: 'openMusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.deleteSongInPlaylistHandler(request, h),
    options: {
      auth: 'openMusic_jwt',
    },
  },

  // ====================================================Playlist_Song_Activities
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getPlaylistActivitiesHandler(request, h),
    options: {
      auth: 'openMusic_jwt',
    },
  },
];

module.exports = routes;

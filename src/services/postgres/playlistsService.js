const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  // ============================================================= PLAYLISTS
  async postPlaylist(name, ownner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1,$2,$3) RETURNING id',
      values: [id, name, ownner],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan playlist');
    }
    return result.rows[0].id;
  }
  async getPlaylist(owner) {
    const query = {
      text: 'SELECT playlists.id,playlists.name,users.username FROM playlists RIGHT JOIN users ON users.id=playlists.owner  LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE playlists.owner = $1 OR collaborations.user_id = $1  GROUP BY playlists.id, playlists.name, users.username',
      values: [owner],
      // text: 'SELECT playlists.id,playlists.name,users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner',
    };
    const result = await this.pool.query(query);

    return result.rows;
  }
  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus playlist');
    }
  }

  // ============================================================= PLAYLIST SONGS
  async postSongInPlaylist(songId, playlistId) {
    await this.verifySongById(songId);
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1,$2,$3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan lagu kedalam playlist');
    }

    this.addPlaylistActivities(playlistId, songId, (result.command = 'add'));
    return result.rows[0].id;
  }
  async getSongsInPlaylist(id) {
    const querySongsInPlaylist = {
      text: 'SELECT songs.id,songs.title,songs.performer FROM playlist_songs LEFT JOIN songs ON songs.id=playlist_songs.song_id WHERE playlist_id=$1',
      values: [id],
    };
    const songs = await this.pool.query(querySongsInPlaylist);
    if (!songs.rows.length) {
      throw new InvariantError('Lagu dalam playlist tidak ditemukan');
    }
    const queryPlaylist = {
      text: 'SELECT playlists.id,playlists.name,users.username FROM playlists LEFT JOIN users ON users.id=playlists.owner WHERE playlists.id=$1',
      values: [id],
    };
    const playlist = await this.pool.query(queryPlaylist);
    playlist.rows[0].songs = songs.rows;

    return playlist.rows[0];
  }
  async deleteSongInPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id=$1 AND song_id=$2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus lagu dalam playlist');
    }
    this.addPlaylistActivities(playlistId, songId, (result.command = 'delete'));
  }
  // ============================================================= PLAYLIST ACTIVITIES
  async addPlaylistActivities(playlistId, songId, action) {
    const id = nanoid(16);
    const time = new Date().toISOString();
    const queryUserId = {
      text: 'SELECT owner FROM playlists WHERE id=$1',
      values: [playlistId],
    };
    const userId = await this.pool.query(queryUserId);
    const query = {
      text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      values: [id, playlistId, songId, userId.rows[0].owner, action, time],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan kegiatan/activoties');
    }
  }
  async getPlaylistActivities(id) {
    const query = {
      text: 'SELECT users.username,songs.title,playlist_song_activities.action,playlist_song_activities.time FROM playlist_song_activities LEFT JOIN users ON users.id=playlist_song_activities.user_id LEFT JOIN songs ON songs.id=playlist_song_activities.song_id WHERE playlist_id=$1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Tidak terdapat kegiatan/activities');
    }

    return result.rows;
  }

  // --------------------------------------------------------------Verify Song  By Id
  async verifySongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id=$1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  // --------------------------------------------------------------Verify Owner
  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id=$1',
      values: [playlistId],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
  // --------------------------------------------------------------Verify Collavotator
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
  // =====================================================Verify Playlist access
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}
module.exports = PlaylistsService;

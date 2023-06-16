const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const bcrypt = require('bcrypt');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
class UsersService {
  constructor() {
    this.pool = new Pool();
  }
  // =========================================================== USER
  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username=$1',
      values: [username],
    };

    const result = await this.pool.query(query);
    if (result.rows.length) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async postUser(username, password, fullname) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const query = {
      text: 'INSERT INTO users VALUES($1,$2,$3,$4) RETURNING id',
      values: [id, username, hashPassword, fullname],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan user.');
    }

    return result.rows[0].id;
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id,username,password FROM users WHERE username=$1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Username tidak ditemukan');
    }
    const { id, password: hashPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashPassword);
    if (!match) {
      throw new AuthenticationError('Password salah');
    }
    return id;
  }

  // =========================================================== COLLABORATOR
  async verifyUserAndPlaylistExist(playlistId, userId) {
    const queryPlaylist = {
      text: 'SELECT * FROM playlists WHERE id=$1',
      values: [playlistId],
    };

    const resultPlaylist = await this.pool.query(queryPlaylist);

    if (!resultPlaylist.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const query = {
      text: 'SELECT * FROM users WHERE id=$1',
      values: [userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async postCollaborator(playlistId, userId) {
    await this.verifyUserAndPlaylistExist(playlistId, userId);
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO collaborations (id,playlist_id,user_id) VALUES ($1,$2,$3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan collaborator');
    }

    return result.rows[0].id;
  }

  async deleteCollaborator(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id=$1 AND user_id=$2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus collaborator');
    }
  }
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
}

module.exports = UsersService;

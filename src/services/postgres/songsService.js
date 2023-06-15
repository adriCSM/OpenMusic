const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class SongsService {
  constructor() {
    this.pool = new Pool();
  }

  // POST SONG By Album Id Using Request Payload
  async postSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO songs VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt],
    };

    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan Lagu.');
    }

    return result.rows[0].id;
  }

  // GET SONGS
  async getSongs({ title, performer }) {
    let query;
    if (title !== undefined && performer === undefined) {
      query = {
        text: 'SELECT id,title,performer FROM songs WHERE title ILIKE $1',
        values: [title + '%'],
      };
    } else if (title === undefined && performer !== undefined) {
      query = {
        text: 'SELECT id,title,performer FROM songs WHERE performer ILIKE $1',
        values: [performer + '%'],
      };
    } else if (title !== undefined && performer !== undefined) {
      query = {
        text: 'SELECT id,title,performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
        values: [title + '%', performer + '%'],
      };
    } else {
      query = {
        text: 'SELECT id,title,performer FROM songs ',
      };
    }

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows;
  }

  // GET SONG
  async getSongById(id) {
    const query = {
      text: 'SELECT id,title,year,performer,genre,duration,album_id FROM songs WHERE id=$1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows.map(mapDBToModel)[0];
  }
  // GET SONG BY ALBUM ID
  async getSongByAlbumId(albumId) {
    const query = {
      text: 'SELECT id,title,performer FROM songs WHERE album_id=$1',
      values: [albumId],
    };
    const result = await this.pool.query(query);

    return result.rows;
  }

  // PUT SONG
  async putSongById(id, { title, year, genre, performer, duration }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title=$2,year=$3,genre=$4,performer=$5,duration=$6,updated_at=$7 WHERE id=$1 RETURNING id',
      values: [id, title, year, genre, performer, duration, updatedAt],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }
  // DELETE SONG
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;

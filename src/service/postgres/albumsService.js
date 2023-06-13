const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this.pool = new Pool();
  }

  // POST ALBUM
  async postAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO albums VALUES ($1,$2,$3,$4,$5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };
    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan album');
    }
    return result.rows[0].id;
  }

  // GET ALBUM BY ID
  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT id,name,year FROM albums WHERE id=$1',
      values: [id],
    };
    const querySongs = {
      text: 'SELECT id,title,performer FROM songs WHERE album_id=$1',
      values: [id],
    };

    let songs = await this.pool.query(querySongs);
    const album = await this.pool.query(queryAlbum);
    if (!album.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    if (!songs.rows.length) {
      songs.rows = [];
    }
    album.rows[0].songs = songs.rows;
    return album.rows[0];
  }

  // PUT ALBUM BY ID
  async putAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name=$1,year=$2,updated_at=$3  WHERE id=$4 RETURNING id',
      values: [name, year, updatedAt, id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  // DELETE ALBUM BY ID
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
  }
}
module.exports = AlbumService;

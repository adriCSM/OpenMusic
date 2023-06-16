const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this.cacheService = cacheService;
    this.pool = new Pool();
  }

  async checkAlbum(albumId) {
    const query = {
      text: 'SELECT FROM albums WHERE id=$1',
      values: [albumId],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
  async checkLike(userId, albumId) {
    const query = {
      text: 'SELECT FROM user_album_likes WHERE user_id=$1 AND album_id=$2',
      values: [userId, albumId],
    };
    const result = await this.pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Album ini sudah anda like');
    }
  }

  async postLike(userId, albumId) {
    await this.checkAlbum(albumId);
    await this.checkLike(userId, albumId);
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes (id,user_id,album_id) VALUES ($1,$2,$3) RETURNING id',
      values: [id, userId, albumId],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan like');
    }
    await this.cacheService.delete('likes');
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id=$1 AND album_id=$2 RETURNING id',
      values: [userId, albumId],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus like');
    }
    await this.cacheService.delete('likes');
  }

  async getLike(albumId) {
    try {
      const result = await this.cacheService.get('likes');

      return { likes: JSON.parse(result), fromCache: true };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id=$1 ',
        values: [albumId],
      };
      const result = await this.pool.query(query);
      await this.cacheService.set('likes', result.rowCount);

      return { likes: result.rowCount, fromCache: false };
    }
  }
}
module.exports = AlbumLikesService;

const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this.pool = new Pool();
  }
  // ----------------------------------------------------Add Token
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  // ----------------------------------------------------Verify Refresh Token
  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token=$1',
      values: [token],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid.');
    }
  }
  // ----------------------------------------------------Delete Token
  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token=$1',
      values: [token],
    };

    await this.pool.query(query);
  }
}
module.exports = AuthenticationsService;

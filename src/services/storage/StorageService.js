const fs = require('fs');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const path = require('path');

class StorageService {
  constructor(folder) {
    this.folder = folder;
    this.pool = new Pool();

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + '-' + meta.filename;
    const path = `${this.folder}/${filename}`;
    const fileStream = fs.createWriteStream(path);
    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  // ====================================================================== Hapus file yang tidak terdapat pada database albums
  async cekFileInDatabase(file) {
    const result = await this.pool.query({
      text: 'SELECT cover FROM albums WHERE cover=$1',
      values: [`http://${process.env.HOST}:${process.env.PORT}/upload/images/${file}`],
    });
    return result.rows;
  }

  async deleteFile() {
    fs.readdir(this.folder, (err, files) => {
      if (err) console.log(err);
      files.forEach(async (file) => {
        const filePath = path.join(this.folder, file);
        const result = await this.cekFileInDatabase(file);
        if (!result.length) {
          fs.unlink(filePath, (err) => {
            if (err) throw new InvariantError('Gagal menghapus files yang tidak digunakan');
          });
        }
      });
    });
  }
  // ======================================================================

  async updateAlbum(albumId, filename) {
    const url = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    const query = {
      text: 'UPDATE albums SET cover=$1 WHERE id=$2 RETURNING id',
      values: [url, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal memperbarui cover album');
    }
  }
}
module.exports = StorageService;

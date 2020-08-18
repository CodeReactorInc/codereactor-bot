const mariadb = require('mariadb');
const fs = require('fs');
const { getLogger } = require('./logger.js');

const streams = [ fs.createWriteStream(__dirname+'/../logs/latest.log', { flags: 'a' }), process.stdout ];

class DatabaseDriver {
  constructor(host, user, password) {
    this.logger = getLogger("Database Driver", streams);
    this.logger.info("Creating pool...");
    this.pool = mariadb.createPool({ host: host, user: user, password: password});
    this.logger.info("Pool for '"+host+"' created");
  }

  async query(querie, args) {
    return new Promise(async (resolve) => {
      this.logger.info("Connection to database...")
      let conn = await this.pool.getConnection();
      this.logger.info("Sending query...");
      let data = await conn.query(querie, args);
      this.logger.info("Releasing connection...");
      conn.release();
      this.logger.info("Returning query result...");
      resolve(data);
    });
  }

  async has(table, where, args) {
    return (await this.query("SELECT * FROM "+table+" WHERE "+where, args)).length > 0;
  }

  async get(querie, args) {
    let data = await this.query(querie, args);
    if (data.length <= 0) return null;
    return data[0];
  }
}

module.exports = DatabaseDriver;
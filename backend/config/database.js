const mysql = require("mysql2");
require("dotenv").config();

class Database {
  constructor() {
    if (!Database.instance) {
      this.connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      this.connection.connect((err) => {
        if (err) {
          console.error("Error conectando a MySQL:", err);
        } else {
          console.log("MySQL conectado");
        }
      });

      Database.instance = this;
    }

    return Database.instance;
  }

  getConnection() {
    return this.connection;
  }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
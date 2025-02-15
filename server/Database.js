import mysql from "mysql2/promise";

let connection;

export const Database = async () => {
  try {
    if (!connection) {
       mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME1,
      });
    }
    return connection;
  } catch (err) {
    console.log(err);
  }
};
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", // Remplace par ton utilisateur PostgreSQL
  host: "localhost",
  database: "Monapp", // Remplace par ton nom de base de données
  password: "salma2004", // Remplace par ton mot de passe PostgreSQL
  port: 5432,
});

module.exports = pool;

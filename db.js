const { Pool } = require("pg");

// Crée une instance de Pool pour la connexion à la base de données
const pool = new Pool({
  user: "postgres", // Remplace par ton nom d'utilisateur PostgreSQL
  host: "localhost", // Si tu utilises localhost
  database: "Login_db", // Remplace par ton nom de base de données
  password: "malak", // Remplace par ton mot de passe PostgreSQL
  port: 5432, // Le port par défaut de PostgreSQL
});

// Exporte le pool pour l'utiliser dans d'autres fichiers
module.exports = pool;

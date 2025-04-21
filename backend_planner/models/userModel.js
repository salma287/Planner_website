const pool = require("../config/db");

const getUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0]; // ou null si aucun
  } catch (err) {
    console.error("Erreur getUserByEmail :", err);
    throw err;
  }
};

module.exports = { getUserByEmail };

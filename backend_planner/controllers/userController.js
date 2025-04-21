const bcrypt = require("bcrypt");
const pool = require("../config/db");

const signUp = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    dateNaissance,
    mood,
    motivation,
  } = req.body;

  if (!firstName || !lastName || !dateNaissance || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    // Vérifier si l'email existe déjà
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "L'email est déjà utilisé" });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans la base de données
    const newUser = await pool.query(
      "INSERT INTO users (firstname, lastname, email, password_hash, date_of_birth, mood, motivation) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, firstname, lastname, email",
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        dateNaissance,
        mood,
        motivation,
      ]
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

module.exports = { signUp };

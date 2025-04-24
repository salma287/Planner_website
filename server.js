require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Vérification de l’API
app.get('/', (req, res) => {
  res.json({ message: '🚀 Backend JoyPlanner est en ligne !' });
});

// Route pour modifier mot de passe
app.put('/api/change-password', async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
  
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
    }
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await pool.query('UPDATE users SET mot_de_passe = $1 WHERE email = $2', [
        hashedPassword,
        email,
      ]);
  
      res.json({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
      console.error('Erreur serveur :', error);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });
  

app.listen(port, () => {
  console.log(`✅ Backend démarré : http://localhost:${port}`);
});

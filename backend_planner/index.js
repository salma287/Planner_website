const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authController = require("./controllers/authController");
const { authenticateToken } = require("./middlewares/authMiddleware");

require("dotenv").config();

const app = express();
const PORT = 4000;

app.use(express.static("public"));

// Autoriser toutes les origines (tu peux restreindre ensuite)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

const userRoutes = require("./routes/userRoutes");

// Utiliser les routes pour /api/users
app.use("/api/users", userRoutes);

// Exemple de route pour tester une erreur générique
app.get("/test-error", (req, res) => {
  // Générer une erreur générique
  throw new Error("Test d'erreur");
});

// Example route
app.get("/", (req, res) => {
  res.send("Hello World from Express!");
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack); // Afficher l'erreur dans la console pour le débogage

  // Vérifier des erreurs spécifiques si nécessaire
  if (err.code === "23505") {
    // Exemple d'erreur pour une violation de contrainte d'unicité (comme un email déjà utilisé dans PostgreSQL)
    return res.status(400).json({ message: "L'email est déjà utilisé" });
  }

  // Erreur générique pour tout autre cas
  res.status(500).json({ message: "Une erreur inattendue s'est produite." });
});

// Route protégée (requiert un token valide)
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Accès autorisé", userId: req.userId });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

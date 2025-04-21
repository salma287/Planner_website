const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authController = require("./controllers/authController");
const { authenticateToken } = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));

// Middleware
app.use(cors());
app.use(express.json()); // pour parser les corps de requêtes en JSON

// Route de connexion
app.post("/login", authController.login);

// Route protégée (requiert un token valide)
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Accès autorisé", userId: req.userId });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

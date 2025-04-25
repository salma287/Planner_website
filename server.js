require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');

// Configuration initiale
const app = express();

// CORS
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

app.use(express.json());

// SERVIR les fichiers statiques depuis 'public'
app.use(express.static(path.join(__dirname, 'public')));

// VARIABLES
const CLIENT_ID = process.env.CLIENT_ID || "1030539079875-o0ap6l904ocl46fqaokgm5jol3u7hf9p.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "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";
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3001/api/auth/callback';
const PORT = process.env.PORT || 3001;
const DEFAULT_FRONTEND_URL = 'http://localhost:3001';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ CLIENT_ID et CLIENT_SECRET manquants.');
  process.exit(1);
}

// OAuth2
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Logger
app.use((req, _, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health
app.get('/api/health', (_, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      google_auth: 'active',
      calendar_api: 'enabled'
    }
  });
});

// Authentification
const pendingRedirects = new Map();

app.get('/api/auth/init', (req, res) => {
  try {
    const sessionId = Date.now().toString();
    pendingRedirects.set(sessionId, DEFAULT_FRONTEND_URL);

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.readonly'
      ],
      prompt: 'consent',
      state: sessionId
    });

    res.status(200).json({ auth_url: authUrl });
  } catch (error) {
    console.error('Erreur lors de init auth:', error);
    res.status(500).json({ error: 'Erreur auth init', details: error.message });
  }
});

// Callback OAuth
app.get('/api/auth/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${DEFAULT_FRONTEND_URL}/index.html?auth_error=1&message=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect(`${DEFAULT_FRONTEND_URL}/index.html?auth_error=1&message=No_code_provided`);
    }

    const frontendUrl = state && pendingRedirects.has(state)
      ? pendingRedirects.get(state)
      : DEFAULT_FRONTEND_URL;

    if (state) {
      pendingRedirects.delete(state);
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const redirectUrl = new URL(frontendUrl);
    redirectUrl.pathname = '/index.html';
    redirectUrl.searchParams.set('auth_success', '1');
    redirectUrl.searchParams.set('access_token', tokens.access_token);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Erreur auth callback:', error);
    const redirectUrl = new URL(DEFAULT_FRONTEND_URL);
    redirectUrl.pathname = '/index.html';
    redirectUrl.searchParams.set('auth_error', '1');
    redirectUrl.searchParams.set('message', encodeURIComponent(error.message));
    res.redirect(redirectUrl.toString());
  }
});

// Récupérer événements
app.get('/api/events', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    });

    res.json(response.data.items);
  } catch (error) {
    console.error('Erreur récupération événements:', error.message);
    res.status(error.code || 500).json({ error: error.message });
  }
});

// Ajouter un événement
app.post('/api/events', async (req, res) => {
  try {
    const { summary, start, end, description, location } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary,
        description,
        location,
        start: { dateTime: start },
        end: { dateTime: end }
      }
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Erreur ajout événement :', error.message);
    res.status(error.code || 500).json({ error: error.message });
  }
});

// Modifier un événement
app.patch('/api/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { summary, start, end, description, location } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody: {
        summary,
        description,
        location,
        ...(start && { start: { dateTime: start } }),
        ...(end && { end: { dateTime: end } })
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur modification événement :', error.message);
    res.status(error.code || 500).json({ error: error.message });
  }
});

// Supprimer un événement
app.delete('/api/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erreur suppression événement :', error.message);
    res.status(error.code || 500).json({ error: error.message });
  }
});


// Servir index.html par défaut
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur serveur',
    details: err.message,
    timestamp: new Date().toISOString()
  });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

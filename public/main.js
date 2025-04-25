const authButton = document.getElementById('auth-button');
const logoutButton = document.getElementById('logout-button');
const loadingElem = document.getElementById('loading');
const eventsPlaceholder = document.getElementById('events-placeholder');
const calendarEl = document.getElementById('calendar');
const notification = document.getElementById('notification');
const eventModal = document.getElementById('event-modal');
const eventTitleInput = document.getElementById('event-title');
const saveEventBtn = document.getElementById('save-event-btn');
const cancelEventBtn = document.getElementById('cancel-event-btn');

const getApiBaseUrl = () => 'http://localhost:3001/api';
const FRONTEND_URL = 'http://localhost:3001';

let calendarRef = null;
let tempEventInfo = null;

function showNotification(message, duration = 3000) {
  notification.innerHTML = `<span class="icon">✅</span> ${message}`;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, duration);
}

function openEventModal(startStr, endStr) {
  eventTitleInput.value = '';
  eventModal.style.display = 'flex';
  eventModal.classList.add('fadeIn');
  tempEventInfo = { startStr, endStr };
}

function closeEventModal() {
  eventModal.style.display = 'none';
  eventModal.classList.remove('fadeIn');
}

function init() {
  loadingElem.style.display = 'none';

  const urlParams = new URLSearchParams(window.location.search);
  const authSuccess = urlParams.get('auth_success');
  const authError = urlParams.get('auth_error');
  const accessToken = urlParams.get('access_token');
  const errorMessage = urlParams.get('message');

  if (authSuccess || authError) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (authSuccess === '1' && accessToken) {
    localStorage.setItem('calendar_token', accessToken);
    authButton.style.display = 'none';
    logoutButton.style.display = 'flex';
    showNotification('Connexion réussie !');
    renderCalendar();
  } else if (authError === '1') {
    showNotification(`Erreur: ${errorMessage || 'Problème d\'authentification'}`, 5000);
  } else {
    const storedToken = localStorage.getItem('calendar_token');
    if (storedToken) {
      authButton.style.display = 'none';
      logoutButton.style.display = 'flex';
      renderCalendar();
    }
  }

  authButton.addEventListener('click', initiateAuth);
  logoutButton.addEventListener('click', logout);
}

async function initiateAuth() {
  try {
    loadingElem.style.display = 'flex';
    const apiUrl = getApiBaseUrl();
    const authInitUrl = `${apiUrl}/auth/init?frontend_url=${encodeURIComponent(FRONTEND_URL)}`;
    const response = await fetch(authInitUrl);

    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
    const data = await response.json();
    window.location.href = data.auth_url;
  } catch (error) {
    loadingElem.style.display = 'none';
    showNotification('Impossible de se connecter: ' + error.message, 5000);
  }
}

function logout() {
  localStorage.removeItem('calendar_token');
  calendarEl.innerHTML = '';
  calendarEl.style.display = 'none';
  eventsPlaceholder.style.display = 'flex';
  authButton.style.display = 'flex';
  logoutButton.style.display = 'none';
  showNotification('Déconnexion réussie !');
}

function renderCalendar() {
  const token = localStorage.getItem('calendar_token');
  if (!token) return;

  eventsPlaceholder.style.display = 'none';
  loadingElem.style.display = 'none';
  calendarEl.style.display = 'block';

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    slotMinTime: "00:00:00",
    slotMaxTime: "24:00:00",
    scrollTime: "00:00:00", 
    contentHeight: 580,

    allDaySlot: false,
    nowIndicator: true,
    selectable: true,
    editable: true,
    expandRows: true,
    dayMaxEventRows: true,
    locale: 'fr',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: async (info, successCallback, failureCallback) => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/events`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          logout();
          return;
        }

        const data = await res.json();
        const formatted = data.map(evt => ({
          id: evt.id,
          title: evt.summary || 'Sans titre',
          start: evt.start.dateTime || evt.start.date,
          end: evt.end.dateTime || evt.end.date,
        }));

        successCallback(formatted);
      } catch (err) {
        showNotification('Erreur chargement événements', 5000);
        failureCallback(err);
      }
    },
    select: (info) => {
      openEventModal(info.startStr, info.endStr);
    },
    eventClick: (info) => {
      alert(`Événement: ${info.event.title}`);
    }
  });

  calendar.render();
  calendarRef = calendar;
}

saveEventBtn.addEventListener('click', async () => {
  const title = eventTitleInput.value.trim();
  const token = localStorage.getItem('calendar_token');

  if (!title) {
    showNotification("Le titre est obligatoire.", 4000);
    return;
  }

  if (!tempEventInfo) {
    showNotification("Erreur de sélection.", 4000);
    return;
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        summary: title,
        start: tempEventInfo.startStr,
        end: tempEventInfo.endStr
      })
    });

    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    const createdEvent = await res.json();

    if (calendarRef) {
      calendarRef.addEvent({
        id: createdEvent.id,
        title: createdEvent.summary,
        start: createdEvent.start.dateTime || createdEvent.start.date,
        end: createdEvent.end.dateTime || createdEvent.end.date
      });
    }

    showNotification('Événement ajouté avec succès !');
    closeEventModal();
  } catch (error) {
    console.error("Erreur ajout événement:", error);
    showNotification('Erreur lors de l\'ajout.', 4000);
  }
});

cancelEventBtn.addEventListener('click', () => {
  closeEventModal();
});

window.addEventListener('DOMContentLoaded', init);

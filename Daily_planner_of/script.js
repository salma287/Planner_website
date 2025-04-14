document.addEventListener('DOMContentLoaded', function() {
    // Global Variables
    const currentDate = new Date(2025, 3, 1); // April 2025
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Mood Tracking Functions
    function setupMoodTracking() {
        const moodOptions = document.querySelectorAll('.mood-option');
        const currentMoodDisplay = document.getElementById('current-mood');
        
        moodOptions.forEach(option => {
            option.addEventListener('click', function() {
                moodOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                const mood = this.getAttribute('data-mood');
                currentMoodDisplay.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
                
                if (mood === 'happy' || mood === 'excited') {
                    createConfetti();
                }
            });
        });
    }
    
    // Confetti Effect
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '1000';
        document.body.appendChild(confettiContainer);
        
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.opacity = Math.random() * 0.5 + 0.5;
            
            const animation = confetti.animate([
                { top: '-10px', transform: 'rotate(0deg)' },
                { top: '100vh', transform: 'rotate(360deg)' }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                fill: 'forwards'
            });
            
            confettiContainer.appendChild(confetti);
            
            animation.onfinish = () => {
                confetti.remove();
                if (confettiContainer.children.length === 0) {
                    confettiContainer.remove();
                }
            };
        }
    }
    
    // Modal Handling
    function setupModal(openBtn, modalId, closeBtn) {
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                document.getElementById(modalId).style.display = 'block';
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById(modalId).style.display = 'none';
            });
        }
        
        window.addEventListener('click', (event) => {
            if (event.target === document.getElementById(modalId)) {
                document.getElementById(modalId).style.display = 'none';
            }
        });
    }
    
    function initializeModals() {
        // Task Modal
        setupModal(
            document.getElementById('add-task-btn'),
            'task-modal',
            document.querySelector('#task-modal .close-modal')
        );
        
        // Person Modal
        setupModal(
            document.querySelector('.btn-add-person'),
            'person-modal',
            document.querySelector('#person-modal .close-modal')
        );
        
        // Note Modal
        setupModal(
            document.querySelector('.btn-add-note'),
            'note-modal',
            document.querySelector('#note-modal .close-modal')
        );
        
        // Contact Modal
        setupModal(
            null,
            'contact-modal',
            document.querySelector('#contact-modal .close-modal')
        );
        
        // Water Modal
        setupModal(
            document.getElementById('add-water-btn'),
            'water-modal',
            document.querySelector('#water-modal .close-modal')
        );
    }
    
    // Task Management
    function setupTaskManagement() {
        document.getElementById('task-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const taskName = document.getElementById('task-name').value;
            const taskTime = document.getElementById('task-time').value;
            const category = document.querySelector('input[name="category"]:checked').value;
            const notes = document.getElementById('task-notes').value;
            
            if (!taskName) {
                alert('Please enter a task name');
                return;
            }
            
            addNewTask(taskName, taskTime, category, notes);
            this.reset();
            document.getElementById('task-modal').style.display = 'none';
        });
        
        // Add event listeners to existing tasks
        document.querySelectorAll('.btn-complete').forEach(btn => {
            btn.addEventListener('click', completeTask);
        });
        
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', editTask);
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
    
    function addNewTask(name, time, category, notes) {
        const taskList = document.querySelector('.task-list');
        
        let emoji;
        switch(category) {
            case 'work': emoji = '💼'; break;
            case 'personal': emoji = '🏠'; break;
            case 'health': emoji = '❤️'; break;
            default: emoji = '✅';
        }
        
        const newTask = document.createElement('li');
        newTask.className = 'task-item';
        newTask.innerHTML = `
            <div class="task-info">
                <span class="task-emoji">${emoji}</span>
                <div>
                    <h3>${name}</h3>
                    <p>${time || 'No time set'}</p>
                    ${notes ? `<small>${notes}</small>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-complete">✅</button>
                <button class="btn-edit">✏️</button>
                <button class="btn-delete">🗑️</button>
            </div>
        `;
        
        taskList.appendChild(newTask);
        
        newTask.querySelector('.btn-complete').addEventListener('click', completeTask);
        newTask.querySelector('.btn-edit').addEventListener('click', editTask);
        newTask.querySelector('.btn-delete').addEventListener('click', deleteTask);
    }
    
    function completeTask() {
        const taskItem = this.closest('.task-item');
        taskItem.classList.toggle('completed');
        
        if (taskItem.classList.contains('completed')) {
            this.textContent = '↩️';
        } else {
            this.textContent = '✅';
        }
    }
    
    function editTask() {
        const taskItem = this.closest('.task-item');
        const taskName = taskItem.querySelector('h3').textContent;
        const taskTime = taskItem.querySelector('p').textContent;
        const taskNotes = taskItem.querySelector('small')?.textContent || '';
        
        document.getElementById('task-name').value = taskName;
        
        if (taskTime !== 'No time set') {
            document.getElementById('task-time').value = taskTime;
        }
        
        document.getElementById('task-notes').value = taskNotes;
        document.getElementById('task-modal').style.display = 'block';
        taskItem.remove();
    }
    
    function deleteTask() {
        if (confirm('Are you sure you want to delete this task?')) {
            this.closest('.task-item').remove();
        }
    }
    
    // Contact Management
    function setupContactManagement() {
        document.getElementById('person-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('person-name').value;
            const role = document.getElementById('person-role').value;
            const email = document.getElementById('person-email').value;
            const phone = document.getElementById('person-phone').value;
            const avatar = document.querySelector('input[name="avatar"]:checked').value;
            
            if (!name || !role) {
                alert('Please at least provide a name and role');
                return;
            }
            
            addNewContact(name, role, email, phone, avatar);
            this.reset();
            document.getElementById('person-modal').style.display = 'none';
        });
        
        document.querySelector('.btn-delete-contact').addEventListener('click', deleteContact);
        
        // Initialize existing contact cards
        document.querySelectorAll('.person-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('btn-connect')) {
                    openContactModal(this);
                }
            });
            
            card.querySelector('.btn-connect')?.addEventListener('click', function(e) {
                e.stopPropagation();
                const name = this.closest('.person-card').querySelector('h3').textContent;
                alert(`Opening chat with ${name}...`);
            });
        });
    }
    
    function addNewContact(name, role, email, phone, avatar) {
        const peopleList = document.querySelector('.people-list');
        const contactId = 'contact-' + Date.now();
        
        const newContact = document.createElement('div');
        newContact.className = 'person-card';
        newContact.dataset.contactId = contactId;
        newContact.innerHTML = `
            <div class="person-avatar">${avatar}</div>
            <div class="person-info">
                <h3>${name}</h3>
                <p>${role}</p>
            </div>
            <button class="btn-connect">💬</button>
        `;
        
        peopleList.appendChild(newContact);
        
        newContact.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-connect')) {
                openContactModal(this, name, role, email, phone, avatar);
            }
        });
        
        newContact.querySelector('.btn-connect').addEventListener('click', function() {
            alert(`Opening chat with ${name}...`);
        });
    }
    
    function openContactModal(contactCard, name, role, email, phone, avatar) {
        const contactId = contactCard.dataset.contactId;
        const avatarEmoji = contactCard.querySelector('.person-avatar').textContent;
        const contactName = name || contactCard.querySelector('h3').textContent;
        const contactRole = role || contactCard.querySelector('p').textContent;
        
        document.getElementById('contact-avatar').textContent = avatarEmoji;
        document.getElementById('contact-name').textContent = contactName;
        document.getElementById('contact-role').textContent = contactRole;
        
        document.getElementById('contact-email').textContent = email || 'Not specified';
        document.getElementById('contact-email').href = email ? `mailto:${email}` : '#';
        document.getElementById('contact-phone').textContent = phone || 'Not specified';
        document.getElementById('contact-phone').href = phone ? `tel:${phone}` : '#';
        
        const modal = document.getElementById('contact-modal');
        modal.setAttribute('data-contact-id', contactId);
        modal.style.display = 'block';
    }
    
    function deleteContact() {
        const modal = document.getElementById('contact-modal');
        const contactId = modal.getAttribute('data-contact-id');
        const contactToDelete = document.querySelector(`.person-card[data-contact-id="${contactId}"]`);
        
        if (contactToDelete && confirm('Are you sure you want to delete this contact permanently?')) {
            contactToDelete.remove();
            modal.style.display = 'none';
        }
    }
    
    // Note Management
    function setupNoteManagement() {
        document.getElementById('note-form').addEventListener('submit', function(e) {
            e.preventDefault();
            saveNote();
        });
        
        document.querySelector('.btn-delete-note').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this note?')) {
                document.getElementById('note-modal').style.display = 'none';
                document.getElementById('note-form').reset();
                alert('Note deleted');
            }
        });
        
        document.querySelector('.btn-save').addEventListener('click', saveQuickNote);
        
        // Load saved notes
        renderNotes();
        
        // Load saved quick note
        const savedNote = localStorage.getItem('joyplanner-quick-note');
        if (savedNote) {
            document.querySelector('.notes-section textarea').value = savedNote;
        }
    }
    
    function saveNote() {
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        
        if (!title || !content) {
            alert('Please enter both title and content');
            return;
        }
        
        const note = {
            id: Date.now(),
            title,
            content,
            date: new Date().toLocaleDateString()
        };
        
        let notes = JSON.parse(localStorage.getItem('joyplanner-notes') || '[]');
        notes.push(note);
        localStorage.setItem('joyplanner-notes', JSON.stringify(notes));
        
        renderNotes();
        document.getElementById('note-modal').style.display = 'none';
        document.getElementById('note-form').reset();
    }
    
    function renderNotes() {
        const notesContainer = document.getElementById('saved-notes');
        const notes = JSON.parse(localStorage.getItem('joyplanner-notes') || '[]');
        
        notesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            notesContainer.innerHTML = '<p>No notes yet. Click "Add" to create one!</p>';
            return;
        }
        
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <small>${note.date}</small>
            `;
            notesContainer.appendChild(noteElement);
        });
    }
    
    function saveQuickNote() {
        const noteContent = document.querySelector('.notes-section textarea').value;
        localStorage.setItem('joyplanner-quick-note', noteContent);
        
        this.textContent = '✔️ Saved!';
        setTimeout(() => {
            this.textContent = '💾 Save Notes';
        }, 2000);
    }
    
    function setupWaterTracker() {
        const waterOptions = document.querySelectorAll('.water-option');
        const waterForm = document.getElementById('water-form');
        const waterProgress = document.getElementById('water-progress');
        const waterProgressBar = document.getElementById('water-progress-bar');
        const waterAmountDisplay = document.getElementById('water-amount');
        const waterWave = document.createElement('div');
        const addWaterBtn = document.getElementById('add-water-btn');

        let currentWater = 0;
        const dailyGoal = 2000;

        // Add wave effect
        waterWave.className = 'water-wave';
        waterProgressBar.appendChild(waterWave);

        waterOptions.forEach(option => {
            option.addEventListener('click', function() {
                waterOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        waterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let amount = 0;
            
            const selected = document.querySelector('.water-option.selected');
            if (selected) {
                amount = parseInt(selected.dataset.amount);
            } else if (document.getElementById('custom-water')?.value) {
                amount = parseInt(document.getElementById('custom-water').value);
            }

            if (amount > 0) {
                currentWater = Math.min(currentWater + amount, dailyGoal);
                updateWaterDisplay();
                
                // Create ripple effect
                createRippleEffect(amount);
                
                // Celebrate if goal reached
                if (currentWater >= dailyGoal) {
                    celebrateGoal();
                }
                
                this.reset();
                document.getElementById('water-modal').style.display = 'none';
            } else {
                alert('Please select or enter a valid amount');
            }
        });

        function updateWaterDisplay() {
            const percentage = (currentWater / dailyGoal) * 100;
            waterProgressBar.style.width = `${percentage}%`;
            waterAmountDisplay.textContent = `${currentWater}ml / ${dailyGoal}ml`;
            
            // Update wave position
            waterWave.style.transform = `translateY(${100 - percentage}%)`;
            
            // Change color based on progress
            if (percentage < 30) {
                waterProgressBar.style.background = 'linear-gradient(90deg, #3b82f6, #60a5fa)';
            } else if (percentage < 70) {
                waterProgressBar.style.background = 'linear-gradient(90deg, #2563eb, #3b82f6)';
            } else {
                waterProgressBar.style.background = 'linear-gradient(90deg, #1e40af, #2563eb)';
            }
            
            localStorage.setItem('joyplanner-water', currentWater);
        }

        function createRippleEffect(amount) {
            const ripple = document.createElement('div');
            ripple.className = 'water-ripple';
            ripple.style.width = `${Math.min(amount / 10, 30)}px`;
            ripple.style.height = `${Math.min(amount / 10, 30)}px`;
            waterProgressBar.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        }

        function celebrateGoal() {
            // Add celebration class
            waterProgress.classList.add('goal-celebrating');
            
            // Create bubbles
            for (let i = 0; i < 10; i++) {
                createBubble();
            }
            
            // Remove celebration after animation
            setTimeout(() => {
                waterProgress.classList.remove('goal-celebrating');
            }, 3000);
        }

        function createBubble() {
            const bubble = document.createElement('div');
            bubble.className = 'water-bubble';
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.width = `${Math.random() * 10 + 5}px`;
            bubble.style.height = bubble.style.width;
            waterProgress.appendChild(bubble);
            
            setTimeout(() => {
                bubble.remove();
            }, 3000);
        }

        // Load saved data
        const savedWater = localStorage.getItem('joyplanner-water');
        if (savedWater) currentWater = parseInt(savedWater);
        updateWaterDisplay();
    }

    // Initialize water tracker
    setupWaterTracker();

   
   
       
    
    // Calendar Functions
    function setupCalendar() {
        const currentMonthDisplay = document.getElementById('current-month');
        const calendarDays = document.getElementById('calendar-days');
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        
        prevMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        nextMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        renderCalendar();
        
        function renderCalendar() {
            currentMonthDisplay.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
            
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            
            calendarDays.innerHTML = '';
            
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                calendarDays.appendChild(emptyDay);
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.textContent = day;
                
                const today = new Date();
                if (day === today.getDate() && 
                    currentDate.getMonth() === today.getMonth() && 
                    currentDate.getFullYear() === today.getFullYear()) {
                    dayElement.classList.add('today');
                }
                
                dayElement.addEventListener('click', function() {
                    alert(`You selected ${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`);
                });
                
                calendarDays.appendChild(dayElement);
            }
        }
    }
    
    // Initialize all functionality
    function init() {
        setupMoodTracking();
        initializeModals();
        setupTaskManagement();
        setupContactManagement();
        setupNoteManagement();
        setupWaterTracker();
        setupCalendar();
    }
    
    // Start the application
    init();
});
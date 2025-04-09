document.addEventListener('DOMContentLoaded', function() {
    // Mood Selection
    const moodOptions = document.querySelectorAll('.mood-option');
    const currentMoodDisplay = document.getElementById('current-mood');
    
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update display
            const mood = this.getAttribute('data-mood');
            currentMoodDisplay.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
        });
    });
    
    // Task Modal
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.btn-cancel');
    const taskForm = document.getElementById('task-form');
    
    addTaskBtn.addEventListener('click', function() {
        taskModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', function() {
        taskModal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        taskModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
    });
    
    // Task Form Submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskName = document.getElementById('task-name').value;
        const taskTime = document.getElementById('task-time').value;
        const category = document.querySelector('input[name="category"]:checked').value;
        
        if (taskName.trim() === '') {
            alert('Please enter a task name');
            return;
        }
        
        addNewTask(taskName, taskTime, category);
        
        // Reset form
        taskForm.reset();
        taskModal.style.display = 'none';
    });
    
    // Function to add new task
    function addNewTask(name, time, category) {
        const taskList = document.querySelector('.task-list');
        
        // Get icon based on category
        let iconClass;
        switch(category) {
            case 'work':
                iconClass = 'fas fa-briefcase';
                break;
            case 'personal':
                iconClass = 'fas fa-home';
                break;
            case 'health':
                iconClass = 'fas fa-heartbeat';
                break;
            default:
                iconClass = 'fas fa-tasks';
        }
        
        const newTask = document.createElement('li');
        newTask.className = 'task-item';
        newTask.innerHTML = `
            <div class="task-info">
                <i class="${iconClass} task-icon"></i>
                <div>
                    <h3>${name}</h3>
                    <p>${time || 'No time set'}</p>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-complete"><i class="far fa-check-circle"></i></button>
                <button class="btn-edit"><i class="far fa-edit"></i></button>
                <button class="btn-delete"><i class="far fa-trash-alt"></i></button>
            </div>
        `;
        
        taskList.appendChild(newTask);
        
        // Add event listeners to new task buttons
        newTask.querySelector('.btn-complete').addEventListener('click', completeTask);
        newTask.querySelector('.btn-edit').addEventListener('click', editTask);
        newTask.querySelector('.btn-delete').addEventListener('click', deleteTask);
    }
    
    // Task Actions
    function completeTask() {
        const taskItem = this.closest('.task-item');
        taskItem.classList.toggle('completed');
    }
    
    function editTask() {
        const taskItem = this.closest('.task-item');
        const taskName = taskItem.querySelector('h3').textContent;
        const taskTime = taskItem.querySelector('p').textContent;
        
        // Fill the form with existing values
        document.getElementById('task-name').value = taskName;
        document.getElementById('task-time').value = taskTime;
        
        // Open modal
        taskModal.style.display = 'block';
        
        // Remove the old task
        taskItem.remove();
    }
    
    function deleteTask() {
        if (confirm('Are you sure you want to delete this task?')) {
            this.closest('.task-item').remove();
        }
    }
    
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
    
    // Calendar
    const currentMonthDisplay = document.getElementById('current-month');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    let currentDate = new Date(2025, 3, 1); // April 2025
    
    function renderCalendar() {
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthDisplay.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Get first day of month and total days in month
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        
        // Clear previous days
        calendarDays.innerHTML = '';
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            calendarDays.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            
            // Highlight today
            const today = new Date();
            if (day === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Initial render
    renderCalendar();
    
    // Save Notes
    const saveNotesBtn = document.querySelector('.btn-save');
    const notesTextarea = document.querySelector('.notes-section textarea');
    
    saveNotesBtn.addEventListener('click', function() {
        localStorage.setItem('joyplanner-notes', notesTextarea.value);
        alert('Notes saved!');
    });
    
    // Load saved notes
    const savedNotes = localStorage.getItem('joyplanner-notes');
    if (savedNotes) {
        notesTextarea.value = savedNotes;
    }
    
    // Connect buttons
    document.querySelectorAll('.btn-connect').forEach(btn => {
        btn.addEventListener('click', function() {
            const personName = this.closest('.person-card').querySelector('h3').textContent;
            alert(`Connecting with ${personName}...`);
        });
    });
    
    // Add person button
    document.querySelector('.btn-add-person').addEventListener('click', function() {
        alert('Add new contact feature coming soon!');
    });
    
    // Search notes button
    document.querySelector('.btn-search').addEventListener('click', function() {
        alert('Search notes feature coming soon!');
    });
});
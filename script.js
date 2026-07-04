let input = document.getElementById('taskInput');
let button = document.getElementById('addTaskButton');
let taskList = document.getElementById('taskList');
const STORAGE_KEY = 'dailyTasks';
let tasks = [];

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createEditPopup(taskTextSpan, taskObj) {
    let overlay = document.createElement('div');
    overlay.className = 'edit-overlay';

    let popup = document.createElement('div');
    popup.className = 'edit-popup';

    let heading = document.createElement('h3');
    heading.textContent = 'Edit Task';

    let editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = taskTextSpan.textContent;
    editInput.className = 'edit-input';

    let saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'save-button';

    let cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'cancel-button';

    saveButton.addEventListener('click', function () {
        let updatedTask = editInput.value.trim();

        if (updatedTask !== '') {
            taskObj.text = updatedTask;
            taskTextSpan.textContent = updatedTask;
            saveTasks();
        }

        document.body.removeChild(overlay);
    });

    cancelButton.addEventListener('click', function () {
        document.body.removeChild(overlay);
    });

    popup.appendChild(heading);
    popup.appendChild(editInput);
    popup.appendChild(saveButton);
    popup.appendChild(cancelButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    editInput.focus();
}

function createTaskItem(taskObj) {
    let listItem = document.createElement('li');
    listItem.className = 'task-item';

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = taskObj.completed;

    let taskTextSpan = document.createElement('span');
    taskTextSpan.className = 'task-text';
    taskTextSpan.textContent = taskObj.text;

    if (taskObj.completed) {
        taskTextSpan.classList.add('completed');
    }

    let editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';

    checkbox.addEventListener('change', function () {
        taskObj.completed = checkbox.checked;
        taskTextSpan.classList.toggle('completed', checkbox.checked);
        saveTasks();
    });

    editButton.addEventListener('click', function () {
        createEditPopup(taskTextSpan, taskObj);
    });

    deleteButton.addEventListener('click', function () {
        tasks = tasks.filter(function (item) {
            return item !== taskObj;
        });
        saveTasks();
        taskList.removeChild(listItem);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(taskTextSpan);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}

function loadTasks() {
    let savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [];
    }

    taskList.innerHTML = '';
    tasks.forEach(function (taskObj) {
        createTaskItem(taskObj);
    });
}

function addTask() {
    let task = input.value.trim();

    if (task !== '') {
        let newTask = {
            text: task,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        createTaskItem(newTask);
        input.value = '';
        input.focus();
    }
}

button.addEventListener('click', addTask);

input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask();
    }
});

loadTasks();
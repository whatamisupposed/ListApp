function createTaskElement(taskName, completed = false) {
    var li = document.createElement('li');
    li.textContent = taskName;

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        deleteTask(li);
        saveData(); 
    };
    li.appendChild(deleteButton);

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = function() {
        var newText = prompt("Enter new text for the task:", taskName);
        if (newText !== null && newText.trim() !== "") {
            li.textContent = newText.trim();
            saveData(); // Save edited data
        }
    };
    li.appendChild(editButton);

    var completeCheckbox = document.createElement('input');
    completeCheckbox.type = 'checkbox';
    completeCheckbox.checked = completed;
    completeCheckbox.addEventListener('change', function() {
        if (completeCheckbox.checked) {
            li.style.textDecoration = 'line-through';
        } else {
            li.style.textDecoration = 'none';
        }
        saveData(); 
    });
    li.appendChild(completeCheckbox);

    if (completed) {
        li.style.textDecoration = 'line-through';
    }

    return li;
}

function editTask(li) {
    var taskTextElement = li.firstChild; // Get the text node of the list item
    var taskText = taskTextElement.textContent; // Get the text content of the list item
    var newText = prompt("Enter new text for the task:", taskText);
    if (newText !== null && newText.trim() !== "") {
        taskTextElement.textContent = newText.trim(); // Update the text content of the list item

        // Update the checkbox state based on the current text decoration
        var completeCheckbox = li.querySelector('input[type="checkbox"]');
        if (li.style.textDecoration === 'line-through') {
            completeCheckbox.checked = true;
        } else {
            completeCheckbox.checked = false;
        }

        saveData(); // Save edited data
    }
}



// Attach event listener to the container for edit button click event
document.querySelector('.container').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('edit')) {
        var taskElement = event.target.closest('li');
        editTask(taskElement);
    }
});

function attachTaskEventListeners(taskList) {
    taskList.querySelectorAll('li').forEach(function(task) {
        var editButton = task.querySelector('button.edit-task');
        if (editButton) {
            editButton.addEventListener('click', function() {
                editTask(task);
                saveData();
            });
        }

        var deleteButton = task.querySelector('button.delete-task');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                deleteTask(task);
                saveData();
            });
        }

        var completeCheckbox = task.querySelector('input[type="checkbox"]');
        if (completeCheckbox) {
            completeCheckbox.addEventListener('change', function() {
                if (completeCheckbox.checked) {
                    task.style.textDecoration = 'line-through';
                } else {
                    task.style.textDecoration = 'none';
                }
                saveData();
            });
        }
    });
}

function addTask(taskInput, taskListId) {
    var task = taskInput.value.trim();
    if (task !== '') {
        var taskList = document.getElementById(taskListId);
        if (!taskList) {
            console.error("Task list not found!");
            return;
        }
        var li = createTaskElement(task);

        taskList.appendChild(li);

        // Attach event listeners for the newly added task
        attachTaskEventListeners(li.parentNode);

        taskInput.value = '';
        saveDataForCurrentUser(); 
    }
}

function deleteTask(task) {
    task.parentNode.removeChild(task);
}

function clearCompletedTasks(taskList) {
    taskList.querySelectorAll('li').forEach(function(task) {
        if (task.querySelector('input[type="checkbox"]').checked) {
            task.parentNode.removeChild(task);
        }
    });
}

function createTaskElement(taskName, completed = false) {
    var li = document.createElement('li');
    li.textContent = taskName;

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        deleteTask(li);
        saveData(); 
    };
    li.appendChild(deleteButton);

    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = function() {
        editTask(li);
    };
    li.appendChild(editButton);

    var completeCheckbox = document.createElement('input');
    completeCheckbox.type = 'checkbox';
    completeCheckbox.checked = completed;
    completeCheckbox.addEventListener('change', function() {
        if (completeCheckbox.checked) {
            li.style.textDecoration = 'line-through';
        } else {
            li.style.textDecoration = 'none';
        }
        saveData(); 
    });
    li.appendChild(completeCheckbox);

    if (completed) {
        li.style.textDecoration = 'line-through';
    }

    return li;
}

// Load tasks for the current user
function loadTasksForCurrentUser() {
    const taskLists = document.querySelectorAll('.list-container ul');
    taskLists.forEach(function(taskList) {
        attachTaskEventListeners(taskList);
    });
}

// Call the function to load tasks for the current user
loadTasksForCurrentUser();

document.querySelectorAll('.add-task').forEach(function(addTaskButton) {
    addTaskButton.addEventListener('click', function() {
        var taskInput = this.parentNode.querySelector('input[type="text"]');
        var taskListId = this.parentNode.querySelector('ul').id;
        addTask(taskInput, taskListId);
    });
});
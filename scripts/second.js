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
        attachTaskEventListeners(li);

        taskInput.value = '';
        saveData(); // Save data after adding a task
    }
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


function deleteTask(task) {
    task.parentNode.removeChild(task);
    saveData();
}

document.querySelectorAll('.add-task').forEach(function(addTaskButton) {
    addTaskButton.addEventListener('click', function() {
        var taskInput = this.parentNode.querySelector('input[type="text"]');
        var taskListId = this.parentNode.querySelector('ul').id;
        addTask(taskInput, taskListId);
    });
});


function createTaskElement(taskName, completed = false) {
    var li = document.createElement('li');

    // Create a span to hold the task text
    var taskText = document.createElement('span');
    taskText.textContent = taskName;
    li.appendChild(taskText);

    // Create the delete button
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        deleteTask(li);
        saveData(); 
    };
    li.appendChild(deleteButton);

    // Create the edit button
    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = function() {
        editTask(li);
    };
    li.appendChild(editButton);

    // Create the checkbox
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


function attachTaskEventListeners(task) {
    var editButton = task.querySelector('button.edit');
    if (editButton) {
        editButton.addEventListener('click', function() {
            editTask(task);
            saveData();
        });
    }

    var deleteButton = task.querySelector('button.delete');
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
        attachTaskEventListeners(task);

        taskInput.value = '';
        saveData();
    }
}

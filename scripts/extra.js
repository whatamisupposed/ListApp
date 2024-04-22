function loadDataForCurrentUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileName = urlParams.get('profile');

    let userData = loadTodoData(profileName);

    if (userData && userData.lists) {
        var container = document.querySelector('.container');
        container.innerHTML = '';

        userData.lists.forEach(function(listData) {
            var newListDiv = createListContainer(listData);
            container.appendChild(newListDiv);
            // Attach event listeners and perform other necessary operations
        });
    }

    // Restore input value after page reload
    const addTaskInputs = document.querySelectorAll('.list-container input[type="text"]');
    addTaskInputs.forEach(input => {
        const listId = input.nextElementSibling.id;
        const storedTaskInput = localStorage.getItem(`taskInput_${profileName}_${listId}`);
        if (storedTaskInput) {
            input.value = storedTaskInput;
        }
    });
}

function saveDataForCurrentUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileName = urlParams.get('profile');

    var data = {
        lists: []
    };
    var container = document.querySelector('.container');
    container.querySelectorAll('.list-container').forEach(function(listContainer) {
        var listData = {
            name: listContainer.querySelector('input[type="text"]').value.trim(),
            tasks: []
        };
        listContainer.querySelectorAll('ul li').forEach(function(task) {
            var taskObj = {
                name: task.textContent,
                completed: task.querySelector('input[type="checkbox"]').checked
            };
            listData.tasks.push(taskObj);
        });
        data.lists.push(listData);
    });

    localStorage.setItem(`todoData_${profileName}`, JSON.stringify(data)); // Use profile-specific key
    console.log(`Data saved for profile: ${profileName}`, data); // Log saved data
}


// Load tasks for the current user
function loadTasksForCurrentUser1() {
    const taskLists = document.querySelectorAll('.list-container ul');
    taskLists.forEach(function(taskList) {
        attachTaskEventListeners(taskList);
    });
}
// Call the function to load tasks for the current user
loadTasksForCurrentUser();


// Load tasks for the current user
function loadTasksForCurrentUser() {
    const taskLists = document.querySelectorAll('.list-container ul');
    taskLists.forEach(function(taskList) {
        taskList.querySelectorAll('li').forEach(function(task) {
            attachTaskEventListeners(task);
        });
    });
}


function attachTaskEventListeners1(taskList) {
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
            completeCheckbox.addEventListener('change', handleCheckboxChange);
        }
    });
}

// Event handler for checkbox change
function handleCheckboxChange1() {
    var taskElement = this.closest('li');
    if (this.checked) {
        taskElement.style.textDecoration = 'line-through';
    } else {
        taskElement.style.textDecoration = 'none';
    }
    saveData();
}


function addTask1(taskInput, taskListId) {
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
        saveData(); 
    }
}


function createTaskElement2(taskName, completed = false) {
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

function clearCompletedTasks1(taskList) {
    taskList.querySelectorAll('li').forEach(function(task) {
        if (task.querySelector('input[type="checkbox"]').checked) {
            task.parentNode.removeChild(task);
        }
    });
}

function loadTodoData(profileName) {
    let todoData = JSON.parse(localStorage.getItem(`todoData_${profileName}`)) || { lists: [] };
    return todoData;
}
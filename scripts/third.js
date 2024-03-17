document.addEventListener('DOMContentLoaded', function() {
    loadDataForCurrentUser(); // Load data for the current user, including tasks
    loadTasksForCurrentUser(); // Attach event listeners to the loaded tasks

    document.querySelector('.container').addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-task')) {
            var listContainer = event.target.closest('.list-container');
            if (listContainer) {
                var newTaskInput = listContainer.querySelector('input[type="text"]');
                var taskList = listContainer.querySelector('ul');
                addTask(newTaskInput, taskList.id);
                saveDataForCurrentUser(); // Save data after adding a task
            }
        }
    });

    // Add event listeners for adding new lists
    document.querySelectorAll('.add-list').forEach(function(addListButton) {
        addListButton.addEventListener('click', function() {
            addNewList();
        });
    });
});

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
    const addTaskInputs = document.querySelectorAll('.list-container input[type="text"]');
    addTaskInputs.forEach(input => {
        const listId = input.nextElementSibling.id;
        const storedTaskInput = localStorage.getItem(`taskInput_${profileName}_${listId}`);
        if (storedTaskInput) {
            input.value = storedTaskInput;
        }
    });
}

// Add event listener for the task input to save its value
newTaskInput.addEventListener('input', function() {
    localStorage.setItem(`taskInput_${profileName}_${newTaskList.id}`, newTaskInput.value);
});

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

function loadTodoData(profileName) {
    let todoData = JSON.parse(localStorage.getItem(`todoData_${profileName}`)) || { lists: [] };
    return todoData;
}

window.addEventListener('beforeunload', function() {
    saveDataForCurrentUser();
});

// Add event listeners for drag-and-drop functionality

function attachTaskEventListeners(container) {
    container.querySelectorAll('.list-container ul li').forEach(function(task) {
        task.setAttribute('draggable', true); // Make tasks draggable

        task.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', task.id); // Set the dragged task's ID
            task.classList.add('dragging'); // Add a class to indicate dragging
        });

        task.addEventListener('dragend', function() {
            task.classList.remove('dragging'); // Remove the dragging class after dragging ends
        });

        task.addEventListener('dragover', function(event) {
            event.preventDefault(); // Allow drop
            const draggedTaskId = event.dataTransfer.getData('text/plain');
            const draggedTask = document.getElementById(draggedTaskId);
            if (draggedTask && draggedTask !== task && draggedTask.parentNode === task.parentNode) {
                const afterElement = getDragAfterElement(task, event.clientY);
                const parent = task.parentNode;
                if (afterElement === null) {
                    parent.appendChild(draggedTask);
                } else {
                    parent.insertBefore(draggedTask, afterElement);
                }
            }
        });

        task.addEventListener('drop', function(event) {
            event.preventDefault();
            const draggedTaskId = event.dataTransfer.getData('text/plain');
            const newListId = task.parentNode.id;
            const newTaskIndex = Array.from(task.parentNode.children).indexOf(task);
            const newData = updateTaskOrder(draggedTaskId, newListId, newTaskIndex);
            saveData(newData);
        });
    });
}

// Helper function to get the element to insert the dragged task after
function getDragAfterElement(task, y) {
    const draggableElements = [...task.parentNode.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


function createListContainer(listData) {
    var newListDiv = document.createElement('div');
    newListDiv.classList.add('list-container');

    var newListNameInput = document.createElement('input');
    newListNameInput.type = 'text';
    newListNameInput.value = listData.name;
    newListNameInput.addEventListener('input', function() {
        saveDataForCurrentUser();
    });
    newListDiv.appendChild(newListNameInput);

    var newTaskList = document.createElement('ul');
    listData.tasks.forEach(function(taskObj) {
        var li = createTaskElement(taskObj.name, taskObj.completed);
        newTaskList.appendChild(li);
    });
    newListDiv.appendChild(newTaskList);

    var deleteListButton = document.createElement('button');
    deleteListButton.textContent = 'Delete List';
    deleteListButton.onclick = function() {
        newListDiv.remove();
        saveDataForCurrentUser();
    };
    newListDiv.appendChild(deleteListButton);

    var clearCompletedButton = document.createElement('button');
    clearCompletedButton.textContent = 'Clear Completed';
    clearCompletedButton.onclick = function() {
        clearCompletedTasks(newTaskList);
        saveDataForCurrentUser();
    };
    newListDiv.appendChild(clearCompletedButton);

    var addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
    addTaskButton.onclick = function() {
        addTask(newTaskInput, newTaskList.id);
        saveDataForCurrentUser();
    };
    newListDiv.appendChild(addTaskButton);

    // Attach event listeners for editing, deleting, and completing tasks
    attachTaskEventListeners(newListDiv);

    return newListDiv;
}
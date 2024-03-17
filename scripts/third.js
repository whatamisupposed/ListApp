document.addEventListener('DOMContentLoaded', function() {
    loadData(); // Load data for the current user, including tasks
   // loadTasksForCurrentUser(); // Attach event listeners to the loaded tasks

    document.querySelector('.container').addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-task')) {
            var listContainer = event.target.closest('.list-container');
            if (listContainer) {
                var newTaskInput = listContainer.querySelector('input[type="text"]');
                var taskList = listContainer.querySelector('ul');
                addTask(newTaskInput, taskList.id);
                saveData(); // Save data after adding a task
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

function loadTodoData(profileName) {
    let todoData = JSON.parse(localStorage.getItem(`todoData_${profileName}`)) || { lists: [] };
    return todoData;
}

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
        saveData();
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
        saveData();
    };
    newListDiv.appendChild(deleteListButton);

    var clearCompletedButton = document.createElement('button');
    clearCompletedButton.textContent = 'Clear Completed';
    clearCompletedButton.onclick = function() {
        clearCompletedTasks(newTaskList);
        saveData();
    };
    newListDiv.appendChild(clearCompletedButton);

  
    var addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
    addTaskButton.onclick = function() {
        addTask(newTaskInput, newTaskList.id);
        saveData(); 
    };
    newListDiv.appendChild(addTaskButton);

    // Attach event listeners for editing, deleting, and completing tasks
    attachTaskEventListeners(newListDiv);

    return newListDiv;
}
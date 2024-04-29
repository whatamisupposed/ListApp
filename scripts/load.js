function saveData() {
    var container = document.querySelector('.container');
    var data = {
        lists: []
    };
    container.querySelectorAll('.list-container').forEach(function(listContainer) {
        var listData = {
            name: listContainer.querySelector('input[type="text"]').value.trim(),
            tasks: []
        };
        listContainer.querySelectorAll('ul li').forEach(function(task) {
            var taskObj = {
                name: task.querySelector('span').textContent,
                completed: task.querySelector('input[type="checkbox"]').checked
            };
            listData.tasks.push(taskObj);
        });
        data.lists.push(listData);
    });
    localStorage.setItem('todoData', JSON.stringify(data));
}

function loadData() {
    var data = JSON.parse(localStorage.getItem('todoData'));
    if (data) {
        var container = document.querySelector('.container');
        container.innerHTML = ''; // Clear container before loading

        data.lists.forEach(function(listData) {
            var newListDiv = document.createElement('div');
            newListDiv.classList.add('list-container');
            
            var newListNameInput = document.createElement('input');
            newListNameInput.type = 'text';
            newListNameInput.value = listData.name;
            addListNameToTopNav(listData.name);
            newListNameInput.addEventListener('input', function() {
                saveData(); 
            });
            newListDiv.appendChild(newListNameInput);

            var newListHeading = document.createElement('h2');
            newListHeading.textContent = listData.name;
            newListDiv.appendChild(newListHeading);

            var newTaskInput = document.createElement('input');
            newTaskInput.type = 'text';
            newTaskInput.placeholder = 'Enter a task...';
            newListDiv.appendChild(newTaskInput);

            var newTaskList = document.createElement('ul');
            listData.tasks.forEach(function(taskObj) {
                var li = createTaskElement(taskObj.name, taskObj.completed);
                newTaskList.appendChild(li);
            });
            newListDiv.appendChild(newTaskList);

            var deleteListButton = document.createElement('button');
            deleteListButton.textContent = 'Delete List';
            deleteListButton.onclick = function() {
                container.removeChild(newListDiv);
                saveData(); 
                removeListNameFromTopNav(newListHeading.textContent); 
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

            container.appendChild(newListDiv);

            // Attach event listeners for editing, deleting, and completing tasks
            attachTaskEventListeners(newTaskList);

            // Restore the value of task input based on saved data
            newTaskInput.value = ''; // Clear the input initially
        });
    }
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
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
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

// Attach event listeners for all task lists
document.querySelectorAll('.list-container ul').forEach(function(taskList) {
    attachTaskEventListeners(taskList);
});


// Update task order in the data
function updateTaskOrder(draggedTaskId, newListId, newTaskIndex) {
    const urlParams = new URLSearchParams(window.location.search);
    const profileName = urlParams.get('profile');
    const data = loadTodoData(profileName);
    const [listIndex, taskIndex] = getIndices(draggedTaskId);
    const task = data.lists[listIndex].tasks.splice(taskIndex, 1)[0];
    data.lists[newListId].tasks.splice(newTaskIndex, 0, task);
    return data;
}

// Get list and task indices from the task's ID
function getIndices(taskId) {
    const [listId, taskIndex] = taskId.split('_');
    return [parseInt(listId), parseInt(taskIndex)];
}
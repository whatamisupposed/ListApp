document.addEventListener8('DOMContentLoaded', function() {
    loadData(); // Load data for the current user, including tasks
    // loadTasksForCurrentUser(); // Attach event listeners to the loaded tasks

    document.querySelector('.container').addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-task')) {
            var listContainer = event.target.closest('.list-container');
            if (listContainer) {
                var newTaskInput = listContainer.querySelector('input[type="text"]');
                var taskList = listContainer.querySelector('ul');
                addTask(newTaskInput, taskList.id);
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

document.addEventListener('DOMContentLoaded', function() {
    loadData(); // Load data for the current user, including tasks

    document.querySelector('.container').addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-task')) {
            var listContainer = event.target.closest('.list-container');
            if (listContainer) {
                var newTaskInput = listContainer.querySelector('input[type="text"]');
                var taskList = listContainer.querySelector('ul');
                addTask(newTaskInput, taskList.id);
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

// Add event listeners for all task lists
document.querySelectorAll('.list-container ul').forEach(function(taskList) {
    attachTaskEventListeners(taskList);
});

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
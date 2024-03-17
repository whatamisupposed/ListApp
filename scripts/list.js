function addNewList() {
    var container = document.querySelector('.container');
    var newListDiv = document.createElement('div');

    newListDiv.classList.add('list-container');

    var newListNameInput = document.createElement('input');
    newListNameInput.type = 'text';
    newListNameInput.placeholder = 'Enter list name...';
    newListNameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            var newListName = newListNameInput.value.trim();
            if (newListName !== '') {
                addListNameToTopNav(newListName); 
                changeListName(newListNameInput);
            }
        }
    });
    newListDiv.appendChild(newListNameInput);

    var newTaskInput = document.createElement('input');
    newTaskInput.type = 'text';
    newTaskInput.placeholder = 'Enter a task...';
    newTaskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask(newTaskInput, newTaskList.id);
        }
    });
    newListDiv.appendChild(newTaskInput);

    var newListHeading = document.createElement('h2');
    newListHeading.textContent = newListNameInput.value || 'New List';
    newListDiv.appendChild(newListHeading);

    var newTaskList = document.createElement('ul');
    newTaskList.id = 'taskList_' + Date.now(); 
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

    // Add event listener for the "Add Task" button
    addTaskButton.addEventListener('click', function() {
        addTask(newTaskInput, newTaskList.id);
        saveData(); 
    });

    // Ensure event listeners for editing, deleting, and completing tasks are attached
    attachTaskEventListeners(newTaskList);

    saveData(); 
}

function changeListName(listNameInput) {
    var listName = listNameInput.value.trim();
    if (listName !== '') {
        var newListHeading = listNameInput.parentNode.querySelector('h2');
        var oldListName = newListHeading.textContent;
        newListHeading.textContent = listName;
        updateListNameInTopNav(oldListName, listName); 
        saveData(); 
    }
}

function updateListNameInTopNav(oldName, newName) {
    var topNav = document.querySelector('.topNav');
    var listNameButtons = topNav.querySelectorAll('.list-name');
    listNameButtons.forEach(function(button) {
        if (button.textContent === oldName) {
            button.textContent = newName;
        }
    });
}

function addListNameToTopNav(listName) {
    var topNav = document.querySelector('.topNav');
    topNav.querySelectorAll('.list-name[data-list-name="' + listName + '"]').forEach(function(button) {
        button.remove();
    });
    
    var listNameButton = document.createElement('button');
    listNameButton.textContent = listName;
    listNameButton.classList.add('list-name');
    listNameButton.setAttribute('data-list-name', listName); 
    listNameButton.onclick = function() {
    
        var container = document.querySelector('.container');
        container.querySelectorAll('.list-container').forEach(function(listContainer) {
            var nameInput = listContainer.querySelector('input[type="text"]');
            if (nameInput && nameInput.value === listName) {
                listContainer.style.display = listContainer.style.display === 'none' ? 'block' : 'none';
            }
        });
    };
    topNav.appendChild(listNameButton);
    saveData();
}

function removeListNameFromTopNav(listName) {
    var topNav = document.querySelector('.topNav');
    var listNameButtons = topNav.querySelectorAll('.list-name');
    listNameButtons.forEach(function(button) {
        if (button.textContent === listName) {
            button.remove();
        }
    });
}

localStorage.setItem('userProfiles', JSON.stringify(profiles)); 
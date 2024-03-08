function addNewList() { // js for index.html
    var container = document.querySelector('.container');
    var newListDiv = document.createElement('div');

    newListDiv.classList.add('list-container');

    var newListNameInput = document.createElement('input');
    newListNameInput.type = 'text';
    newListNameInput.placeholder = 'Enter list name...';
    newListNameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            changeListName(newListNameInput);
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

    saveData(); 
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
        taskInput.value = '';
        saveData(); 
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
                name: task.textContent,
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
        var topNav = document.querySelector('.topNav');
        topNav.innerHTML = ''; 

        var listNames = []; 
        data.lists.forEach(function(listData) {
            var newListName = listData.name.trim();
            if (newListName !== '' && !listNames.includes(newListName)) {
                listNames.push(newListName); 
                addListNameToTopNav(newListName); 
            }
            var newListDiv = document.createElement('div');
            newListDiv.classList.add('list-container');
            
            var newListNameInput = document.createElement('input');
            newListNameInput.type = 'text';
            newListNameInput.value = newListName;
            newListNameInput.addEventListener('input', function() {
                saveData(); 
            });
            newListDiv.appendChild(newListNameInput);

            var newListHeading = document.createElement('h2');
            newListHeading.textContent = newListName;
            newListDiv.appendChild(newListHeading);

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

            container.appendChild(newListDiv);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

  document.addEventListener("DOMContentLoaded", function(){
    loadData(); 
    document.querySelectorAll('.sidebar .nav-link').forEach(function(element){
        element.addEventListener('click', function (e) {
            let nextEl = element.nextElementSibling;
            let parentEl  = element.parentElement;	
  
            if(nextEl) {
                e.preventDefault();	
                let mycollapse = new bootstrap.Collapse(nextEl);
                
                if(nextEl.classList.contains('show')){
                    mycollapse.hide();
                } else {
                    mycollapse.show();
                   
                    var opened_submenu = parentEl.parentElement.querySelector('.submenu.show');
                  
                    if(opened_submenu){
                        new bootstrap.Collapse(opened_submenu);
                    }
                }
            }
        }); 
    }) 
}); 
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
function editTask(taskElement) {
    var newText = prompt("Enter new text for the task:", taskElement.textContent);
    if (newText !== null && newText.trim() !== "") {
        taskElement.textContent = newText.trim();
        saveData(); // Save edited data
    }
}
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
            newListNameInput.addEventListener('input', function() {
                saveData(); 
            });
            newListDiv.appendChild(newListNameInput);

            var newListHeading = document.createElement('h2');
            newListHeading.textContent = listData.name;
            newListDiv.appendChild(newListHeading);

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

            container.appendChild(newListDiv);

            addListNameToTopNav(listData.name); // editing lists are annoying
        });
    }
}

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
                name: task.textContent, // Update to include task text
                completed: task.querySelector('input[type="checkbox"]').checked
            };
            listData.tasks.push(taskObj);
        });
        data.lists.push(listData);
    });
    localStorage.setItem('todoData', JSON.stringify(data));
}

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

    saveData(); 
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
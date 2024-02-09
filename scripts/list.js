         function addNewList() {
            var container = document.querySelector('.container');
            var newListDiv = document.createElement('div');

            newListDiv.classList.add('list-container');

            var newListNameInput = document.createElement('input');
            newListNameInput.type = 'text';
            newListNameInput.placeholder = 'Enter list name...';
            newListNameInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
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

            var addTaskButton = document.createElement('button');
            addTaskButton.textContent = 'Add Task';
            addTaskButton.onclick = function() {
                saveTask(newTaskInput, newTaskList.id);
            };
            newListDiv.appendChild(addTaskButton);

            var deleteListButton = document.createElement('button');
            deleteListButton.textContent = 'Delete List';
            deleteListButton.onclick = function() {
                container.removeChild(newListDiv);
            };
            newListDiv.appendChild(deleteListButton);

            container.appendChild(newListDiv);

            newTaskInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    addTask(newTaskInput, newTaskList.id);
                }
            });
        }
        function addTask(taskInput, taskListId) {
            var task = taskInput.value.trim();
            if (task !== '') {
                var taskList = document.getElementById(taskListId);
                var li = document.createElement('li');
                li.textContent = task;

                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = function() {
                    deleteTask(li);
                };
                li.appendChild(deleteButton);

                taskList.appendChild(li);
                taskInput.value = '';
            }
        }
        function deleteTask(task) {
            task.parentNode.removeChild(task);
        }
        function changeListName(listNameInput) {
            var listName = listNameInput.value.trim();
            if (listName !== '') {
                var newListHeading = listNameInput.parentNode.querySelector('h2');
                newListHeading.textContent = listName;
            }
        }
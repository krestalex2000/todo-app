(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;
        
        input.addEventListener('input', function() {
            if (input.value.trim() === '') {
                button.disabled = true;
            } else {
                button.disabled = false;
            }
        });

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name, obj = false) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        if(obj) {
            item.textContent = obj.name;

            if(obj.done) {
                item.classList.add('list-group-item-success');
            }
        } else {
            item.textContent = name;
        }

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';
        
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function createTodoApp(container, title = 'Список дел', array = false, storageKey) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        let todoItem;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);  

        if(array) {
            array.forEach(element => {
                todoItem = createTodoItem('', element);
                todoList.append(todoItem.item);
            });
        }

        if( localStorage.getItem(storageKey) ) {
            for( let item of JSON.parse( localStorage.getItem(storageKey) ) ){
                session.push(item);
                todoItem = createTodoItem('', item);
                todoList.append(todoItem.item);
            }
        }

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            if(!todoItemForm.input.value) {
                return;
            }

            todoItem = createTodoItem(todoItemForm.input.value);
            session.push({name: todoItem.item.firstChild.textContent, done: todoItem.item.classList.contains('list-group-item-success')});
            localStorage.setItem(storageKey, JSON.stringify(session));
            todoList.append(todoItem.item);
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });

        todoList.addEventListener('click', function(event) {
            let target = event.target;
            let targetName = target.parentElement.parentElement.firstChild.textContent;

            if(target.classList.contains('btn-success')) {
                target.parentElement.parentElement.classList.toggle('list-group-item-success');

                let findElement = session.find(item => item.name == targetName);
                
                if(findElement) {
                    if(findElement.done) {
                        findElement.done = false;
                    } else {
                        findElement.done = true;
                    }
                    localStorage.setItem(storageKey, JSON.stringify(session));
                }
            }

            if(target.classList.contains('btn-danger')) {
                if (confirm('Вы уверены?') ) {
                    target.parentElement.parentElement.remove();
                }

                let findElement = session.find(item => item.name == targetName);

                if(findElement) {
                    let itemIndex = session.indexOf(findElement, 0);
                    session.splice(itemIndex, 1);
                    localStorage.setItem(storageKey, JSON.stringify(session));
                }
            }
        });

        
    }

    window.createTodoApp = createTodoApp;
})();
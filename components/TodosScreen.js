import { createElement, createList, createForm, createButton } from '../utils/createElement.js';
import { getTodos, createTodo } from '../utils/api.js';

export async function renderTodosScreen(userId) {
    const container = createElement('div', { className: 'todos-screen' });

    const title = createElement('h1', {}, ['Todos']);
    container.appendChild(title);

    try {
        let allTodos;
        if (userId) {
            allTodos = await getTodos().then(todos => todos.filter(todo => todo.userId == userId));
        } else {
            allTodos = await getTodos();
        }

        const controlsContainer = createElement('div', { className: 'search-container' });

        const searchInput = createElement('input', {
            type: 'text',
            className: 'search-input',
            placeholder: 'Search by title...'
        });

        let currentSearchQuery = '';

        const updateDisplay = () => {
            const filteredTodos = allTodos.filter(todo =>
                todo.title.toLowerCase().includes(currentSearchQuery.toLowerCase())
            );

            const existingList = container.querySelector('.todos-list');
            if (existingList) {
                container.removeChild(existingList);
            }

            const todosList = createList(filteredTodos, renderTodoItem);
            todosList.classList.add('todos-list');
            container.appendChild(todosList);
        };

        searchInput.oninput = (e) => {
            currentSearchQuery = e.target.value;
            updateDisplay();
        };

        controlsContainer.appendChild(searchInput);

        if (userId) {
            const addButton = createButton('Add Todo', () => showAddTodoForm(userId));
            controlsContainer.appendChild(addButton);
        }

        container.appendChild(controlsContainer);

        const todosList = createList(allTodos, renderTodoItem);
        todosList.classList.add('todos-list');
        container.appendChild(todosList);

    } catch (error) {
        const errorElement = createElement('div', { className: 'error' }, ['Error loading todos']);
        container.appendChild(errorElement);
    }

    return container;
}

function renderTodoItem(todo) {
    const todoItem = createElement('div', { className: 'list-item todo-item' });

    const checkbox = createElement('input', {
        type: 'checkbox',
        checked: todo.completed,
        disabled: true
    });

    const title = createElement('span', {
        className: todo.completed ? 'completed' : ''
    }, [todo.title]);

    todoItem.appendChild(checkbox);
    todoItem.appendChild(title);

    return todoItem;
}

function showAddTodoForm(userId) {
    const modal = createElement('div', { className: 'modal' });
    const modalContent = createElement('div', { className: 'modal-content' });

    const closeButton = createElement('button', {
        className: 'close-btn',
        onclick: () => document.body.removeChild(modal)
    }, ['×']);

    modalContent.appendChild(closeButton);

    const form = createForm([
        { name: 'title', label: 'Title', required: true },
        { name: 'completed', label: 'Completed', type: 'checkbox' }
    ], async (formData) => {
        try {
            await createTodo({
                title: formData.title,
                completed: formData.completed,
                userId: parseInt(userId)
            });
            document.body.removeChild(modal);
            window.location.reload();
        } catch (error) {
            alert('Error adding todo');
        }
    }, 'Add Todo');

    modalContent.appendChild(form);
    modal.appendChild(modalContent);

    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
        z-index: 1000;
    `;
    modalContent.style.cssText = `
        background: white; padding: 20px; border-radius: 5px; max-width: 500px; width: 90%;
        position: relative;
    `;
    closeButton.style.cssText = `
        position: absolute; top: 10px; right: 10px; background: none; border: none;
        font-size: 24px; cursor: pointer;
    `;

    document.body.appendChild(modal);
}

import { createElement, createList, createForm, createButton, createSearchInput } from '../utils/createElement.js';
import { getTodos, createTodo } from '../utils/api.js';

export async function renderTodosScreen(userId, searchQuery = '') {
    const container = createElement('div', { className: 'todos-screen' });

    const title = createElement('h1', {}, ['Todos']);
    container.appendChild(title);

    try {
        let todos;
        if (userId) {
            todos = await getTodos().then(allTodos => allTodos.filter(todo => todo.userId == userId));
        } else {
            todos = await getTodos();
        }

        const filteredTodos = todos.filter(todo =>
            todo.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const controlsContainer = createElement('div', { className: 'search-container' });

        const searchInput = createSearchInput('Search by title...', (query) => {
            renderTodosScreen(userId, query);
        });
        searchInput.value = searchQuery;
        controlsContainer.appendChild(searchInput);

        if (userId) {
            const addButton = createButton('Add Todo', () => showAddTodoForm(userId));
            controlsContainer.appendChild(addButton);
        }

        container.appendChild(controlsContainer);

        const todosList = createList(filteredTodos, renderTodoItem);
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
                completed: formData.completed === 'on',
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

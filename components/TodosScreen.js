import { createElement, createList } from '../utils/createElement.js';
import { getTodos } from '../utils/api.js';

export async function renderTodosScreen(userId) {
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

        const todosList = createList(todos, renderTodoItem);
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

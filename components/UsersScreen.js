import { createElement, createList, createButton } from '../utils/createElement.js';
import { getUsers } from '../utils/api.js';

export async function renderUsersScreen() {
    const container = createElement('div', { className: 'users-screen' });

    const title = createElement('h1', {}, ['Users']);
    container.appendChild(title);

    try {
        const users = await getUsers();

        const usersList = createList(users, renderUserItem);
        container.appendChild(usersList);

    } catch (error) {
        const errorElement = createElement('div', { className: 'error' }, ['Error loading users']);
        container.appendChild(errorElement);
    }

    return container;
}

function renderUserItem(user) {
    const userItem = createElement('div', { className: 'list-item user-item' });

    const userInfo = createElement('div', { className: 'user-info' });

    const name = createElement('h3', {}, [user.name]);
    const email = createElement('p', {}, [`Email: ${user.email}`]);
    const username = createElement('p', {}, [`Username: ${user.username}`]);

    userInfo.appendChild(name);
    userInfo.appendChild(email);
    userInfo.appendChild(username);

    userItem.appendChild(userInfo);

    const actions = createElement('div', { className: 'user-actions' });

    const todosButton = createButton('View Todos', () => {
        window.location.hash = `users#${user.id}#todos`;
    });
    actions.appendChild(todosButton);

    const postsButton = createButton('View Posts', () => {
        window.location.hash = `users#${user.id}#posts`;
    });
    actions.appendChild(postsButton);

    userItem.appendChild(actions);

    return userItem;
}

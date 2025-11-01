import { createElement, createList, createForm, createButton } from '../utils/createElement.js';
import { getUsers } from '../utils/api.js';
import { getStoredUsers, addStoredUser, removeStoredUser } from '../utils/storage.js';

export async function renderUsersScreen() {
    const container = createElement('div', { className: 'users-screen' });

    const title = createElement('h1', {}, ['Users']);
    container.appendChild(title);

    try {
        const [apiUsers, storedUsers] = await Promise.all([getUsers(), getStoredUsers()]);
        const allUsers = [...apiUsers, ...storedUsers];

        const controlsContainer = createElement('div', { className: 'search-container' });

        const searchInput = createElement('input', {
            type: 'text',
            className: 'search-input',
            placeholder: 'Search by name or email...'
        });

        let currentSearchQuery = '';

        const updateDisplay = () => {
            const filteredUsers = allUsers.filter(user =>
                user.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(currentSearchQuery.toLowerCase())
            );

            const existingList = container.querySelector('.users-list');
            if (existingList) {
                container.removeChild(existingList);
            }

            const usersList = createList(filteredUsers, renderUserItem);
            usersList.classList.add('users-list');
            container.appendChild(usersList);
        };

        searchInput.oninput = (e) => {
            currentSearchQuery = e.target.value;
            updateDisplay();
        };

        controlsContainer.appendChild(searchInput);

        const addButton = createButton('Add User', () => showAddUserForm());
        controlsContainer.appendChild(addButton);

        container.appendChild(controlsContainer);

        // Навигация к общим экранам
        const navigationContainer = createElement('div', { className: 'navigation-container' });

        const todosButton = createButton('View All Todos', () => {
            window.location.hash = 'users#todos';
        }, 'btn btn-primary');
        navigationContainer.appendChild(todosButton);

        const postsButton = createButton('View All Posts', () => {
            window.location.hash = 'users#posts';
        }, 'btn btn-primary');
        navigationContainer.appendChild(postsButton);

        const commentsButton = createButton('View All Comments', () => {
            window.location.hash = 'users#posts#comments';
        }, 'btn btn-primary');
        navigationContainer.appendChild(commentsButton);

        container.appendChild(navigationContainer);

        const usersList = createList(allUsers, renderUserItem);
        usersList.classList.add('users-list');
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

    if (user.isCustom) {
        const deleteButton = createButton('Delete', () => {
                if (confirm('Are you sure you want to delete this user?')) {
                    removeStoredUser(user.id);
                    window.location.reload();
                }
        }, 'btn btn-danger');
        actions.appendChild(deleteButton);
    }

    userItem.appendChild(actions);

    return userItem;
}

function showAddUserForm() {
    const modal = createElement('div', { className: 'modal' });
    const modalContent = createElement('div', { className: 'modal-content' });

    const closeButton = createElement('button', {
        className: 'close-btn',
        onclick: () => document.body.removeChild(modal)
    }, ['×']);

    modalContent.appendChild(closeButton);

    const form = createForm([
        { name: 'name', label: 'Name', required: true },
        { name: 'username', label: 'Username', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true }
    ], async (formData) => {
        try {
            const newUser = addStoredUser(formData);
            document.body.removeChild(modal);
            window.location.reload();
        } catch (error) {
            alert('Error adding user');
        }
    }, 'Add User');

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

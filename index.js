import { router } from './utils/router.js';
import { createElement } from './utils/createElement.js';
import { renderUsersScreen } from './components/UsersScreen.js';

async function renderApp(route) {
    const root = document.getElementById('root');
    root.innerHTML = '';

    const app = createElement('div', { className: 'app' });

    try {
        if (route === 'users') {
            const usersScreen = await renderUsersScreen();
            app.appendChild(usersScreen);
        } else {
            const usersScreen = await renderUsersScreen();
            app.appendChild(usersScreen);
        }
    } catch (error) {
        console.error('Error rendering screen:', error);
        const errorElement = createElement('div', { className: 'error' }, ['Error loading content']);
        app.appendChild(errorElement);
    }

    root.appendChild(app);
}

router.addRoute('users', renderApp);

document.addEventListener('DOMContentLoaded', () => {
    router.init();
});

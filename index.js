import { router } from './utils/router.js';
import { createElement } from './utils/createElement.js';

async function renderApp(route) {
    const root = document.getElementById('root');
    root.innerHTML = '';

    const app = createElement('div', { className: 'app' });

    const title = createElement('h1', {}, ['SPA App - Base Structure']);
    app.appendChild(title);

    const description = createElement('p', {}, ['Basic structure with routing and element creation utilities.']);
    app.appendChild(description);

    root.appendChild(app);
}

router.addRoute('users', renderApp);

document.addEventListener('DOMContentLoaded', () => {
    router.init();
});

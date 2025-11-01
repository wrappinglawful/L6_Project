import { router } from './utils/router.js';
import { createElement } from './utils/createElement.js';
import { createBreadcrumbs } from './components/Breadcrumbs.js';
import { renderUsersScreen } from './components/UsersScreen.js';
import { renderTodosScreen } from './components/TodosScreen.js';
import { renderPostsScreen } from './components/PostsScreen.js';
import { renderCommentsScreen } from './components/CommentsScreen.js';

async function renderApp(route, params = {}) {
    const root = document.getElementById('root');
    root.innerHTML = '';

    const app = createElement('div', { className: 'app' });

    const breadcrumbs = createBreadcrumbs(route);
    if (breadcrumbs) {
        app.appendChild(breadcrumbs);
    }

    let screenContent;

    try {
        if (route === 'users') {
            screenContent = await renderUsersScreen();
        } else if (route === 'users#todos') {
            screenContent = await renderTodosScreen();
        } else if (route === 'users#posts') {
            screenContent = await renderPostsScreen();
        } else if (route === 'users#posts#comments') {
            screenContent = await renderCommentsScreen();
        } else if (params.userId && params.postId) {
            screenContent = await renderCommentsScreen(params.postId);
        } else if (params.userId) {
            const routeParts = route.split('#');
            if (routeParts[2] === 'todos') {
                screenContent = await renderTodosScreen(params.userId);
            } else if (routeParts[2] === 'posts') {
                screenContent = await renderPostsScreen(params.userId);
            } else {
                screenContent = await renderUsersScreen();
            }
        } else {
            screenContent = await renderUsersScreen();
        }
    } catch (error) {
        console.error('Error rendering screen:', error);
        screenContent = createElement('div', { className: 'error' }, ['Error loading content']);
    }

    app.appendChild(screenContent);
    root.appendChild(app);
}

router.addRoute('users', renderApp);
router.addRoute('users#todos', renderApp);
router.addRoute('users#posts', renderApp);
router.addRoute('users#posts#comments', renderApp);

router.addRouteHandler('users#:userId#todos', (route, params) => {
    renderApp(route, params);
});

router.addRouteHandler('users#:userId#posts', (route, params) => {
    renderApp(route, params);
});

router.addRouteHandler('users#:userId#posts#:postId#comments', (route, params) => {
    renderApp(route, params);
});

document.addEventListener('DOMContentLoaded', () => {
    const currentHash = window.location.hash;
    if (!currentHash || currentHash === '#/' || currentHash.includes('index.html')) {
        history.replaceState(null, null, '#users');
        router.handleRouteDirect('users');
    } else {
        router.handleRouteDirect(currentHash.slice(1));
    }
    router.init();
});

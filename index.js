import { router } from './utils/router.js';
import { createElement } from './utils/createElement.js';
import { renderUsersScreen } from './components/UsersScreen.js';
import { renderTodosScreen } from './components/TodosScreen.js';
import { renderPostsScreen } from './components/PostsScreen.js';
import { renderCommentsScreen } from './components/CommentsScreen.js';

async function renderApp(route, params = {}) {
    const root = document.getElementById('root');
    root.innerHTML = '';

    const app = createElement('div', { className: 'app' });

    const routeParams = router.getRouteParams();
    let screenContent;

    try {
        if (route === 'users') {
            screenContent = await renderUsersScreen();
        } else if (routeParams.action === 'todos') {
            const userId = params.userId || routeParams.userId;
            screenContent = await renderTodosScreen(userId);
        } else if (routeParams.action === 'posts') {
            const userId = params.userId || routeParams.userId;
            screenContent = await renderPostsScreen(userId);
        } else if (routeParams.subAction === 'comments') {
            const postId = params.postId || routeParams.postId;
            screenContent = await renderCommentsScreen(postId);
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
    router.init();
});

import { createElement } from '../utils/createElement.js';

function generateNavigationChain(route) {
    const parts = route.split('#');
    const chain = [];

    if (route === 'users') {
        return chain;
    }

    if (parts[0] === 'users') {
        chain.push({ name: 'Users', route: '#users' });

        if (parts.length === 2) {
            // Общие экраны: users#todos, users#posts
            if (parts[1] === 'todos') {
                chain.push({ name: 'All Todos', route: '#users#todos' });
            } else if (parts[1] === 'posts') {
                chain.push({ name: 'All Posts', route: '#users#posts' });
            }
        } else if (parts.length === 3 && parts[2] === 'comments') {
            // users#posts#comments
            chain.push({ name: 'All Posts', route: '#users#posts' });
            chain.push({ name: 'All Comments', route: '#users#posts#comments' });
        } else if (parts.length >= 3 && parts[1].match(/^\d+$/)) {
            // Маршруты с userId: users#1#todos, users#1#posts
            const userId = parts[1];
            if (parts[2] === 'todos') {
                chain.push({ name: 'Todos', route: `#users#${userId}#todos` });
            } else if (parts[2] === 'posts') {
                chain.push({ name: 'Posts', route: `#users#${userId}#posts` });
                if (parts.length >= 4 && parts[3].match(/^\d+$/) && parts.length >= 5 && parts[4] === 'comments') {
                    const postId = parts[3];
                    chain.push({ name: 'Comments', route: `#users#${userId}#posts#${postId}#comments` });
                }
            }
        }
    }

    return chain;
}

export function createBreadcrumbs(currentRoute) {
    const chain = generateNavigationChain(currentRoute);

    if (chain.length === 0) {
        return null;
    }

    const breadcrumbsList = createElement('ul');

    chain.forEach((item, index) => {
        const listItem = createElement('li');

        if (index === chain.length - 1) {
            const span = createElement('span', {}, [item.name]);
            listItem.appendChild(span);
        } else {
            const link = createElement('a', {
                href: item.route
            }, [item.name]);
            listItem.appendChild(link);
        }

        breadcrumbsList.appendChild(listItem);
    });

    const breadcrumbsContainer = createElement('nav', {
        className: 'breadcrumbs'
    }, [breadcrumbsList]);

    return breadcrumbsContainer;
}

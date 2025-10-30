import { createElement, createList, createButton } from '../utils/createElement.js';
import { getPosts } from '../utils/api.js';

export async function renderPostsScreen(userId) {
    const container = createElement('div', { className: 'posts-screen' });

    const title = createElement('h1', {}, ['Posts']);
    container.appendChild(title);

    try {
        let posts;
        if (userId) {
            posts = await getPosts().then(allPosts => allPosts.filter(post => post.userId == userId));
        } else {
            posts = await getPosts();
        }

        const postsList = createList(posts, renderPostItem);
        container.appendChild(postsList);

    } catch (error) {
        const errorElement = createElement('div', { className: 'error' }, ['Error loading posts']);
        container.appendChild(errorElement);
    }

    return container;
}

function renderPostItem(post) {
    const postItem = createElement('div', { className: 'list-item post-item' });

    const postContent = createElement('div', { className: 'post-content' });

    const title = createElement('h3', {}, [post.title]);
    const body = createElement('p', {}, [post.body]);

    postContent.appendChild(title);
    postContent.appendChild(body);

    postItem.appendChild(postContent);

    const actions = createElement('div', { className: 'post-actions' });
    const commentsButton = createElement('button', {
        className: 'btn btn-primary',
        onclick: () => {
            window.location.hash = `users#${post.userId}#posts#${post.id}#comments`;
        }
    }, ['View Comments']);

    actions.appendChild(commentsButton);
    postItem.appendChild(actions);

    return postItem;
}

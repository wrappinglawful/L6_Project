import { createElement, createList, createButton } from '../utils/createElement.js';
import { getPosts } from '../utils/api.js';

export async function renderPostsScreen(userId) {
    const container = createElement('div', { className: 'posts-screen' });

    const title = createElement('h1', {}, ['Posts']);
    container.appendChild(title);

    try {
        let allPosts;
        if (userId) {
            allPosts = await getPosts().then(posts => posts.filter(post => post.userId == userId));
        } else {
            allPosts = await getPosts();
        }

        const controlsContainer = createElement('div', { className: 'search-container' });

        const searchInput = createElement('input', {
            type: 'text',
            className: 'search-input',
            placeholder: 'Search by title or content...'
        });

        let currentSearchQuery = '';

        const updateDisplay = () => {
            const filteredPosts = allPosts.filter(post =>
                post.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                post.body.toLowerCase().includes(currentSearchQuery.toLowerCase())
            );

            const existingList = container.querySelector('.posts-list');
            if (existingList) {
                container.removeChild(existingList);
            }

            const postsList = createList(filteredPosts, renderPostItem);
            postsList.classList.add('posts-list');
            container.appendChild(postsList);
        };

        searchInput.oninput = (e) => {
            currentSearchQuery = e.target.value;
            updateDisplay();
        };

        controlsContainer.appendChild(searchInput);

        container.appendChild(controlsContainer);

        const postsList = createList(allPosts, renderPostItem);
        postsList.classList.add('posts-list');
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

import { createElement, createList, createSearchInput } from '../utils/createElement.js';
import { getComments } from '../utils/api.js';

export async function renderCommentsScreen(postId, searchQuery = '') {
    const container = createElement('div', { className: 'comments-screen' });

    const title = createElement('h1', {}, ['Comments']);
    container.appendChild(title);

    try {
        let comments;
        if (postId) {
            comments = await getComments().then(allComments => allComments.filter(comment => comment.postId == postId));
        } else {
            comments = await getComments();
        }

        const filteredComments = comments.filter(comment =>
            comment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.body.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const controlsContainer = createElement('div', { className: 'search-container' });

        const searchInput = createSearchInput('Search by name or content...', (query) => {
            renderCommentsScreen(postId, query);
        });
        searchInput.value = searchQuery;
        controlsContainer.appendChild(searchInput);

        container.appendChild(controlsContainer);

        const commentsList = createList(filteredComments, renderCommentItem);
        container.appendChild(commentsList);

    } catch (error) {
        const errorElement = createElement('div', { className: 'error' }, ['Error loading comments']);
        container.appendChild(errorElement);
    }

    return container;
}

function renderCommentItem(comment) {
    const commentItem = createElement('div', { className: 'list-item comment-item' });

    const commentContent = createElement('div', { className: 'comment-content' });

    const name = createElement('h4', {}, [comment.name]);
    const email = createElement('p', { className: 'comment-email' }, [`By: ${comment.email}`]);
    const body = createElement('p', { className: 'comment-body' }, [comment.body]);

    commentContent.appendChild(name);
    commentContent.appendChild(email);
    commentContent.appendChild(body);

    commentItem.appendChild(commentContent);

    return commentItem;
}

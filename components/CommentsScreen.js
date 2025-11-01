import { createElement, createList } from '../utils/createElement.js';
import { getComments } from '../utils/api.js';

export async function renderCommentsScreen(postId) {
    const container = createElement('div', { className: 'comments-screen' });

    const title = createElement('h1', {}, ['Comments']);
    container.appendChild(title);

    try {
        let allComments;
        if (postId) {
            allComments = await getComments().then(comments => comments.filter(comment => comment.postId == postId));
        } else {
            allComments = await getComments();
        }

        const controlsContainer = createElement('div', { className: 'search-container' });

        const searchInput = createElement('input', {
            type: 'text',
            className: 'search-input',
            placeholder: 'Search by name or content...'
        });

        let currentSearchQuery = '';

        const updateDisplay = () => {
            const filteredComments = allComments.filter(comment =>
                comment.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                comment.body.toLowerCase().includes(currentSearchQuery.toLowerCase())
            );

            const existingList = container.querySelector('.comments-list');
            if (existingList) {
                container.removeChild(existingList);
            }

            const commentsList = createList(filteredComments, renderCommentItem);
            commentsList.classList.add('comments-list');
            container.appendChild(commentsList);
        };

        searchInput.oninput = (e) => {
            currentSearchQuery = e.target.value;
            updateDisplay();
        };

        controlsContainer.appendChild(searchInput);

        container.appendChild(controlsContainer);

        const commentsList = createList(allComments, renderCommentItem);
        commentsList.classList.add('comments-list');
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

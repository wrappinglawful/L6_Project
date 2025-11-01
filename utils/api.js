const BASE_URL = 'https://jsonplaceholder.typicode.com';

const cache = new Map();

async function fetchWithCache(url, options = {}) {
    const cacheKey = url + JSON.stringify(options);

    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function getUsers() {
    return await fetchWithCache(`${BASE_URL}/users`);
}

export async function getUserTodos(userId) {
    return await fetchWithCache(`${BASE_URL}/todos?userId=${userId}`);
}

export async function getTodos() {
    return await fetchWithCache(`${BASE_URL}/todos`);
}

export async function getUserPosts(userId) {
    return await fetchWithCache(`${BASE_URL}/posts?userId=${userId}`);
}

export async function getPosts() {
    return await fetchWithCache(`${BASE_URL}/posts`);
}

export async function getPostComments(postId) {
    return await fetchWithCache(`${BASE_URL}/comments?postId=${postId}`);
}

export async function getComments() {
    return await fetchWithCache(`${BASE_URL}/comments`);
}

export async function createUser(userData) {
    const users = await getUsers();
    const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...userData
    };
    return newUser;
}

export async function createTodo(todoData) {
    try {
        const response = await fetch(`${BASE_URL}/todos`, {
            method: 'POST',
            body: JSON.stringify(todoData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
}

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

const USERS_KEY = 'custom_users';

export function getStoredUsers() {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error getting stored users:', error);
        return [];
    }
}

export function saveStoredUsers(users) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error('Error saving stored users:', error);
    }
}

export function addStoredUser(user) {
    const users = getStoredUsers();
    const newUser = {
        ...user,
        id: Date.now(),
        isCustom: true
    };
    users.push(newUser);
    saveStoredUsers(users);
    return newUser;
}

export function removeStoredUser(userId) {
    const users = getStoredUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    saveStoredUsers(filteredUsers);
    return filteredUsers;
}

export function getStoredUser(userId) {
    const users = getStoredUsers();
    return users.find(user => user.id === userId);
}

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    init() {
        this.handleRoute();
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
    }

    addRoute(route, handler) {
        this.routes[route] = handler;
    }

    getCurrentRoute() {
        return window.location.hash.slice(1) || 'users';
    }

    handleRoute() {
        const route = this.getCurrentRoute();
        this.currentRoute = route;

        if (this.routes[route]) {
            this.routes[route](route);
            return;
        }

        window.location.hash = 'users';
    }

    navigate(route) {
        window.location.hash = route;
    }
}

export const router = new Router();

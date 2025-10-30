class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.routeHandlers = {};
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

    addRouteHandler(pattern, handler) {
        this.routeHandlers[pattern] = handler;
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

        for (const pattern in this.routeHandlers) {
            if (this.matchRoutePattern(route, pattern)) {
                const params = this.extractRouteParams(route, pattern);
                this.routeHandlers[pattern](route, params);
                return;
            }
        }

        window.location.hash = 'users';
    }

    matchRoutePattern(route, pattern) {
        const routeParts = route.split('#');
        const patternParts = pattern.split('#');

        if (routeParts.length !== patternParts.length) {
            return false;
        }

        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i] !== routeParts[i] && !patternParts[i].startsWith(':')) {
                return false;
            }
        }

        return true;
    }

    extractRouteParams(route, pattern) {
        const routeParts = route.split('#');
        const patternParts = pattern.split('#');
        const params = {};

        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                const paramName = patternParts[i].slice(1);
                params[paramName] = routeParts[i];
            }
        }

        return params;
    }

    navigate(route) {
        window.location.hash = route;
    }
}

export const router = new Router();

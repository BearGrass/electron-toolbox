class Router {
    constructor() {
        this.routes = {};
        this.currentPath = '';
        window.addEventListener('popstate', this.handleRoute.bind(this));
    }

    addRoute(path, pageName) {
        this.routes[path] = pageName;
        console.log('Route added:', path, pageName);
    }

    async navigateTo(path) {
        console.log('in navigateTo#Route:', path);
        if (this.routes[path]) {
            this.currentPath = path;
            history.pushState({}, '', path);
            await this.handleRoute(path);
        }
    }

    async handleRoute(path) {
        console.log('in handleRoute#Route:', path);
        const content = document.getElementById('content');
        const pageName = this.routes[path];
        console.log('Route changed:', path, pageName);
        // print pageName type
        console.log(typeof pageName);
        
        if (!pageName) {
            console.error('Page not found:', path, pageName);
            content.innerHTML = '<h1>404 - Page Not Found</h1>';
            return;
        }

        try {
            console.log('Loading page:', pageName);
            const path = require('path');
            const filePath = path.join(__dirname, '../pages', `${pageName}.html`);
            console.log('filePath:', filePath);
            const response = await fetch(filePath);
            const html = await response.text();
            content.innerHTML = html;
        } catch (error) {
            console.error('Page loading error:', error);
            content.innerHTML = '<h1>404 - Page Not Found</h1>';
        }
    }
}

const router = new Router();
module.exports = { router };
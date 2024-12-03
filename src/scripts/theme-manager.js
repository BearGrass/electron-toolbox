class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themes = ['light', 'dark'];
    }

    setTheme(themeName) {
        if (this.themes.includes(themeName)) {
            document.body.className = `theme-${themeName}`;
            this.currentTheme = themeName;
            localStorage.setItem('theme', themeName);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }
}

const themeManager = new ThemeManager();
module.exports = { themeManager };
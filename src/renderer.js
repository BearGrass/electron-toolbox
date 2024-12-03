const { router  } = require('./scripts/router');
const { sidebar } = require('./scripts/sidebar');
const { themeManager } = require('./scripts/theme-manager');

// console.log('renderer.js');

// 初始化应用
function initializeApp() {
    // 初始化路由
    router.addRoute('#/', 'home');
    router.addRoute('#/about', 'about');
    
    // 初始化主题
    // themeManager.init();
    
    // 初始化侧边栏
    sidebar.init();
}

document.addEventListener('DOMContentLoaded', () => {
    // init app
    initializeApp();
});
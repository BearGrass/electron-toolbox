const { router } = require('./router');

class SidebarController {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarItems = document.querySelectorAll('.sidebar-item');
        this.init();
    }

    init() {
        this.sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleItemClick(e.currentTarget);
            });
        });
    }

    handleItemClick(item) {
        // 移除所有active类
        this.sidebarItems.forEach(i => i.classList.remove('active'));
        // 添加active类到当前项
        item.classList.add('active');

        // 路由导航
        const route = item.dataset.route;
        console.log('clickRoute:', route);
        
        router.navigateTo(route);
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');
    }
}

const sidebar = new SidebarController();
module.exports = { sidebar };
const { router } = window.require('./scripts/router');
const { sidebar } = window.require('./scripts/sidebar');
const { themeManager } = window.require('./scripts/theme-manager');

async function runTool() {
    console.log('runTool');
    const input = document.getElementById('input').value;
    const output = document.getElementById('output');
    
    try {
        output.textContent = '程序运行中...';
        // 调用主进程中的 Python 脚本
        const result = await window.electronAPI.runPython(['tool1', input]);
        output.textContent = result;
    } catch (error) {
        output.textContent = '错误: ' + error;
    }
}

// 初始化应用
function initializeApp() {
    // 初始化路由
    router.addRoute('#/', 'home');
    router.addRoute('#/tools', 'tools');
    router.addRoute('#/about', 'about');
    router.addRoute('#/psender', 'psender');

    // 初始化主题
    // themeManager.init();

    // 初始化侧边栏
    sidebar.init();

    router.navigateTo('#/');
}

document.getElementById('content').addEventListener('click', function (e) {
    // 通过选择器匹配需要响应事件的元素
    if (e.target.matches('.tool-item')) {
        const items = document.querySelectorAll('.tool-item');
        console.log(`找到${items.length}个工具项`);

        items.forEach((item, index) => {
            // 添加点击事件监听器
            console.log(`添加工具${index + 1}的点击事件监听器`);
            item.addEventListener('click', (event) => {
                console.log(`点击了工具${index + 1}`);
                const toolId = event.currentTarget.getAttribute('data-tool');
                console.log(`工具ID: ${toolId}`);

                // 添加视觉反馈
                // event.currentTarget.style.backgroundColor = '#e0e0e0';
                // setTimeout(() => {
                //     event.currentTarget.style.backgroundColor = '';
                // }, 200);
                // console.log('toolId:', toolId);

                // 跳转到对应页面
                try {
                    router.navigateTo(`#/${toolId}`);
                } catch (error) {
                    console.log(`导航错误: ${error.message}`);
                }
            });

            // 添加触摸事件支持
            item.addEventListener('touchstart', (event) => {
                event.preventDefault();
                event.currentTarget.click();
            });
        });
        console.log('Button clicked');
    }
});

// DOM 加载完成后的事件处理
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    console.log('DOM已加载');
    if (e.target.matches('.tool-item')) {
        const items = document.querySelectorAll('.tool-item');
        console.log(`找到${items.length}个工具项`);

        items.forEach((item, index) => {
            // 添加点击事件监听器
            console.log(`添加工具${index + 1}的点击事件监听器`);
            item.addEventListener('click', (event) => {
                console.log(`点击了工具${index + 1}`);
                const toolId = event.currentTarget.getAttribute('data-tool');
                console.log(`工具ID: ${toolId}`);
                try {
                    router.navigateTo(`#/${toolId}`);
                } catch (error) {
                    console.log(`导航错误: ${error.message}`);
                }
            });

            // 添加触摸事件支持
            item.addEventListener('touchstart', (event) => {
                event.preventDefault();
                event.currentTarget.click();
            });
        });
        console.log('Button clicked');
    }
});

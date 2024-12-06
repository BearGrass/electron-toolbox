document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', function () {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    });
});

// 初始化：确保工具箱默认是收起的
document.addEventListener('DOMContentLoaded', function () {
    const toolsDropdown = document.querySelector('.tools-dropdown');
    toolsDropdown.classList.remove('show');
});

// 侧边栏按钮点击处理
document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        // 如果点击的不是工具箱按钮，收起工具箱下拉菜单
        if (this.dataset.page !== 'tools') {
            document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.tools-dropdown').classList.remove('show');
            this.classList.add('active');
            return;
        }

        // 工具箱按钮的处理
        const toolsDropdown = document.querySelector('.tools-dropdown');
        const isExpanded = this.classList.contains('active');

        // 切换工具箱的展开/收起状态
        if (isExpanded) {
            this.classList.remove('active');
            toolsDropdown.classList.remove('show');
        } else {
            document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            toolsDropdown.classList.add('show');
        }
    });
});

// 工具项点击处理
document.querySelectorAll('.tool-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.stopPropagation(); // 防止点击传播到父元素

        // 移除其他工具项的活动状态
        document.querySelectorAll('.tool-item').forEach(i => i.classList.remove('active'));
        // 添加当前工具项的活动状态
        this.classList.add('active');

        // 这里可以添加工具项的具体处理逻辑
        const toolType = this.dataset.tool;
        // 根据工具类型显示相应的内容
        showToolContent(toolType);
    });
});

function loadContent(pageUrl) {
    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            const content = document.getElementById('content');
            content.innerHTML = html;
            
            // 加载对应的 JavaScript 文件
            // 如果文件不存在则不加载
            const pageScript = document.createElement('script');
            const scriptPath = pageUrl.replace('.html', '.js').replace('pages/', 'scripts/');
            if (!scriptPath) {
                return;
            }
            pageScript.src = scriptPath;
            document.body.appendChild(pageScript);
        })
        .catch(error => {
            console.error('加载页面失败:', error);
            document.getElementById('content').innerHTML = '加载失败，请稍后重试';
        });
}

// 显示工具内容的函数
function showToolContent(toolType) {
    // 隐藏所有工具内容
    document.querySelectorAll('.tool-content').forEach(content => {
        content.style.display = 'none';
    });

    // 显示选中的工具内容
    const selectedContent = document.querySelector(`.tool-content[data-tool="${toolType}"]`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    console.log('toolType:', toolType);
    const content = document.getElementById('content');
    const pageName = "pages/" + toolType + ".html";
    loadContent(pageName);
}

// 点击页面其他地方时收起工具箱（可选）
document.addEventListener('click', function (e) {
    const toolsBtn = document.querySelector('.sidebar-btn[data-page="tools"]');
    const toolsDropdown = document.querySelector('.tools-dropdown');

    if (!toolsBtn.contains(e.target) && !toolsDropdown.contains(e.target)) {
        toolsBtn.classList.remove('active');
        toolsDropdown.classList.remove('show');
    }
});

// 添加漂浮的灰尘效果
function createDust() {
    const dust = document.createElement('span');
    dust.className = 'dust';
    dust.innerHTML = '✨';
    dust.style.left = Math.random() * window.innerWidth + 'px';
    dust.style.top = Math.random() * window.innerHeight + 'px';
    document.body.appendChild(dust);

    // 动画结束后移除元素
    dust.addEventListener('animationend', () => {
        dust.remove();
    });
}

// 每500ms创建一个新的灰尘
setInterval(createDust, 500);
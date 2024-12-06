// Add scroll event listener for navbar
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        nav.style.backgroundColor = 'white';
    }
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect for tool cards
    // const toolCards = document.querySelectorAll('.tool-card');
    // toolCards.forEach(card => {
    //     card.addEventListener('mouseenter', function() {
    //         this.style.backgroundColor = '#f8f9fa';
    //     });
        
    //     card.addEventListener('mouseleave', function() {
    //         this.style.backgroundColor = 'white';
    //     });
        
    //     card.addEventListener('click', function() {
    //         const toolId = this.id;
    //         if (toolId === 'protocol') {
    //             // 跳转到协议生成页面
    //             loadContent('pages/protocol.html');
    //             return;
    //         }
    //         console.log(`Clicked on ${toolId} tool`);
    //     });
    // });
});
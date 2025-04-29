// Main JavaScript for portfolio website

document.addEventListener('DOMContentLoaded', function() {
    // Các biến DOM
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const themeToggle = document.querySelector('.theme-switch');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const skillBars = document.querySelectorAll('.skill-level');
    const sections = document.querySelectorAll('section');
    const contactForm = document.getElementById('contactForm');
    const glitchText = document.querySelector('.glitch-text');
    
    // Set data-text attribute cho hiệu ứng glitch
    if (glitchText) {
        glitchText.setAttribute('data-text', glitchText.textContent);
    }

    // Thiết lập theme mode từ localStorage hoặc theo trình duyệt
    function setInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else if (savedTheme === 'light') {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            // Kiểm tra thiết lập hệ thống
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (prefersDark) {
                document.body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            }
        }
    }
    
    // Gọi hàm thiết lập theme ban đầu
    setInitialTheme();
    
    // Xử lý chuyển đổi theme mode
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Xử lý menu toggle trên mobile
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Đóng menu khi nhấp vào mục menu
    const menuItems = document.querySelectorAll('nav a');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Header thay đổi khi scroll
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hiệu ứng skill bars khi scroll đến about section
        const aboutSection = document.getElementById('about');
        if (aboutSection && isInViewport(aboutSection)) {
            skillBars.forEach(bar => {
                const width = bar.style.width;
                // Chỉ áp dụng animation nếu chưa được thiết lập
                if (!bar.classList.contains('animated')) {
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                        bar.classList.add('animated');
                    }, 200);
                }
            });
        }
        
        // Active menu theo section hiện tại
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Scroll xuống khi click vào scroll indicator
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Form submit
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu form
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Hiển thị thông báo xác nhận
            alert(`Cảm ơn ${formData.name}! Tin nhắn của bạn đã được gửi thành công.`);
            
            // Reset form
            contactForm.reset();
            
            // Ở đây bạn có thể thêm code để gửi dữ liệu đến backend hoặc qua email service
            // Ví dụ: sendFormData(formData);
        });
    }
    
    // Kiểm tra phần tử có trong viewport không
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Thêm animation cho các phần tử khi scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
            }
        });
    }
    
    // Gọi animateOnScroll khi scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Gọi một lần khi trang tải
    animateOnScroll();
    
    // Thêm hiệu ứng hover cho project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.project-image img').style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.project-image img').style.transform = 'scale(1)';
        });
    });
    
    // Smooth scroll cho tất cả liên kết nội bộ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
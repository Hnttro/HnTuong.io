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
    const revealText = document.querySelector('.reveal-text');
    
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
        
        // Hiển thị các phần tử khi scroll
        revealOnScroll();
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
                message: document.getElementById('message').value,
                project: document.getElementById('project').value
            };
            
            // Hiển thị thông báo xác nhận
            alert(`Cảm ơn ${formData.name}! Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.`);
            
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
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Thêm các phần tử cần hiệu ứng khi scroll
    function setupRevealElements() {
        const elementsToReveal = document.querySelectorAll('.service-card, .project-item, .testimonial-item, .info-item');
        
        elementsToReveal.forEach((element, index) => {
            element.classList.add('reveal-element');
            element.style.transitionDelay = `${index * 0.1}s`;
        });
    }
    
    // Hiển thị các phần tử với hiệu ứng khi scroll
    function revealOnScroll() {
        const elementsToReveal = document.querySelectorAll('.reveal-element');
        
        elementsToReveal.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('revealed')) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Thiết lập testimonial slider
    function setupTestimonialSlider() {
        const testimonialSlider = document.querySelector('.testimonials-slider');
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const dotsContainer = document.querySelector('.testimonial-dots');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (!testimonialSlider || testimonialItems.length === 0) return;
        
        let currentIndex = 0;
        
        // Tạo các dots
        testimonialItems.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        });
        
        // Thiết lập nút prev
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonialItems.length) % testimonialItems.length;
            goToSlide(currentIndex);
        });
        
        // Thiết lập nút next
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonialItems.length;
            goToSlide(currentIndex);
        });
        
        // Tự động chuyển slide
        let slideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonialItems.length;
            goToSlide(currentIndex);
        }, 5000);
        
        // Tạm dừng khi hover
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % testimonialItems.length;
                goToSlide(currentIndex);
            }, 5000);
        });
        
        // Hàm chuyển slide
        function goToSlide(index) {
            testimonialItems.forEach((item, i) => {
                item.style.display = i === index ? 'block' : 'none';
            });
            
            // Cập nhật dot active
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // Hiển thị slide đầu tiên
        goToSlide(0);
    }
    
    // Thêm hiệu ứng mượt mà cho scrolling
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Thêm hiệu ứng parallax cho hero section
    function setupParallaxEffect() {
        const heroSection = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            
            if (scrollPos < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrollPos * 0.2}px)`;
                heroContent.style.opacity = 1 - (scrollPos * 1.5) / window.innerHeight;
            }
        });
    }
    
    // Thêm hiệu ứng hover cho các thẻ service
    function setupServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.service-icon');
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.service-icon');
                icon.style.transform = 'scale(1) rotate(0)';
            });
        });
    }
    
    // Thêm hiệu ứng typing text cho hero
    function setupTypingEffect() {
        const element = document.querySelector('.hero h2');
        if (!element) return;
        
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--color-primary)';
        
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            } else {
                element.style.borderRight = 'none';
            }
        }
        
        setTimeout(type, 1500); // Bắt đầu sau hiệu ứng reveal
    }
    
    // Khởi tạo tất cả các chức năng khi trang được tải
    function initializeAll() {
        setupRevealElements();
        setupTestimonialSlider();
        setupSmoothScrolling();
        setupParallaxEffect();
        setupServiceCardEffects();
        setupTypingEffect();
        
        // Kích hoạt hiệu ứng reveal cho lần load đầu tiên
        setTimeout(revealOnScroll, 300);
    }
    
    // Gọi function khởi tạo
    initializeAll();
});
document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggleBtn = document.getElementById('theme-toggle');
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const currentTheme = localStorage.getItem('theme') || systemTheme;
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        // Toggle between Sun and Moon icon
        if (theme === 'light') {
            themeToggleBtn.innerHTML = '🌙'; // Moon icon for dark theme choice
            themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        } else {
            themeToggleBtn.innerHTML = '☀️'; // Sun icon for light theme choice
            themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
        }
    }

    // Mobile Navigation Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '☰';
            });
        });
    }

    // Professional Experience Tab Switcher
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Reveal On Scroll & Skill Progress Bar Trigger
    const reveals = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If the entry is the skills container, trigger progress bar animations
                if (entry.target.id === 'skills' || entry.target.contains(document.querySelector('.skill-progress'))) {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        });
    }

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${sectionId}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    });

    // ── Project Screenshot Carousel ────────────────────────────
    const slides     = document.getElementById('project-slides');
    const dots       = document.querySelectorAll('.carousel-dot');
    const prevBtn    = document.getElementById('carousel-prev');
    const nextBtn    = document.getElementById('carousel-next');

    if (slides && prevBtn && nextBtn) {
        const total = document.querySelectorAll('.project-slide').length;
        let current = 0;
        let autoTimer;

        function goTo(index) {
            current = (index + total) % total;
            slides.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => goTo(current + 1), 4000);
        }

        function stopAuto() {
            clearInterval(autoTimer);
        }

        prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
        nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goTo(parseInt(dot.getAttribute('data-slide')));
                startAuto();
            });
        });

        // Pause on hover
        slides.closest('.project-carousel').addEventListener('mouseenter', stopAuto);
        slides.closest('.project-carousel').addEventListener('mouseleave', startAuto);

        startAuto();
    }
});

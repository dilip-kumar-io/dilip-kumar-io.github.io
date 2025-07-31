// Portfolio JavaScript - Essential functionality

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loading...');
    
    // Initialize Materialize components
    initializeMaterialize();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize typing effect
    initializeTypingEffect();
    
    // Initialize particles (if available)
    initializeParticles();
    
    // Initialize skill progress bars
    initializeSkillBars();
    
    console.log('Portfolio loaded successfully!');
});

// Initialize Materialize CSS components
function initializeMaterialize() {
    try {
        // Sidenav
        const sidenavs = document.querySelectorAll('.sidenav');
        if (sidenavs.length > 0) {
            M.Sidenav.init(sidenavs);
        }
        
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        console.log('Materialize components initialized');
    } catch (error) {
        console.log('Materialize not available, continuing without it');
    }
}

// Initialize AOS animations
function initializeAnimations() {
    try {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
            console.log('AOS animations initialized');
        } else {
            console.log('AOS not available, continuing without animations');
        }
    } catch (error) {
        console.log('Animation initialization failed, continuing...');
    }
}

// Typing effect for hero section
function initializeTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const texts = [
        'Senior Software Developer',
        'Senior Sofware Engineer',
        'Full Stack Developer',
        '.NET Core Expert',
        'Cloud Solutions Architect',
        'Software Engineer'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let timeout = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            timeout = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(typeText, timeout);
    }
    
    typeText();
    console.log('Typing effect initialized');
}

// Initialize particles background
function initializeParticles() {
    try {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: '#00ffff' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: false },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#00ffff',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 6,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    }
                },
                retina_detect: true
            });
            console.log('Particles background initialized');
        }
    } catch (error) {
        console.log('Particles.js not available, continuing without particles');
    }
}

// Initialize skill progress bars with animation
function initializeSkillBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    // Intersection Observer to trigger animations when scrolled into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width');
                if (targetWidth) {
                    progressBar.style.width = targetWidth;
                }
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
    
    console.log('Skill progress bars initialized');
}

// Add scroll effect for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.neon-nav');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        }
    }
});

// Contact form submission (basic validation)
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('contact-form')) {
        e.preventDefault();
        
        const name = e.target.querySelector('#name').value;
        const email = e.target.querySelector('#email').value;
        const message = e.target.querySelector('#message').value;
        
        if (name && email && message) {
            alert('Thank you for your message! I will get back to you soon.');
            e.target.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    }
});

console.log('Portfolio scripts loaded');
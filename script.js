// Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const menuOverlay = document.querySelector('.menu-overlay');

// Toggle menu function
function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close menu function
function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Hamburger click event
hamburger.addEventListener('click', toggleMenu);

// Close menu when clicking on overlay
menuOverlay.addEventListener('click', closeMenu);

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Special handling for home link to scroll to absolute top
        if (href === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.member-card, .album-card, .band-story').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Play Button Interactions
document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Reset all play buttons and album cards
        document.querySelectorAll('.play-btn').forEach(b => {
            b.textContent = '▶';
            b.classList.remove('playing');
            const card = b.closest('.album-card');
            card.classList.remove('playing');
        });
        
        // Toggle current button
        if (this.textContent === '▶') {
            this.textContent = '⏸';
            this.classList.add('playing');
            
            // Add zoom effect only
            const albumCard = this.closest('.album-card');
            albumCard.classList.add('playing');
            
            // Auto-stop after 3 seconds (demo)
            setTimeout(() => {
                this.textContent = '▶';
                this.classList.remove('playing');
                albumCard.classList.remove('playing');
            }, 3000);
        } else {
            this.textContent = '▶';
            this.classList.remove('playing');
            const albumCard = this.closest('.album-card');
            albumCard.classList.remove('playing');
        }
    });
});

// Hero Button Interactions
const btnPrimary = document.querySelector('.btn-primary');
if (btnPrimary) {
    btnPrimary.addEventListener('click', () => {
        // Simulate music player opening
        showNotification('🎵 Opening Spotify playlist...');
    });
}

const btnSecondary = document.querySelector('.btn-secondary');
if (btnSecondary) {
    btnSecondary.addEventListener('click', () => {
        // Simulate video opening
        showNotification('📺 Opening Ghost Town music video...');
    });
}

// Notification System
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #000;
        color: #fff;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}



// Music Carousel Functionality
class MusicCarousel {
    constructor() {
        this.currentSlide = 1; // Start at first real slide (after clone)
        this.totalSlides = 5; // Number of real slides
        this.track = document.querySelector('.carousel-track');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dots = document.querySelectorAll('.dot');
        this.albumCards = document.querySelectorAll('.album-card:not(.clone)');
        this.slideWidth = 340; // 300px card + 40px gap
        
        this.init();
    }
    
    init() {
        if (!this.track) return;
        
        this.currentSlide = 0; // Start at first slide
        this.totalSlides = 9; // Total number of slides in track
        this.realSlides = 6; // Number of unique albums in first set
        this.slideWidth = 335; // Width of each slide including gap (315px + 20px gap)
        this.visibleSlides = 3; // Number of cards visible at once
        
        // Calculate center offset to ensure cards are centered
        const containerWidth = 985; // Max width of container
        const totalVisibleWidth = (this.visibleSlides * 315) + ((this.visibleSlides - 1) * 20); // 3 cards + 2 gaps
        const centerOffset = (containerWidth - totalVisibleWidth) / 2;
        
        // Set initial position with center offset
        this.track.style.transform = `translateX(${centerOffset}px)`;
        this.centerOffset = centerOffset;
        this.updateDots();
        
        // Event listeners
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Mini navigation buttons
        const miniPrevBtn = document.querySelector('.mini-prev-btn');
        const miniNextBtn = document.querySelector('.mini-next-btn');
        miniPrevBtn?.addEventListener('click', () => this.prevSlide());
        miniNextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play disabled per user request
        // this.startAutoPlay();
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    updateCarousel() {
        const translateX = this.centerOffset + (-this.currentSlide * this.slideWidth);
        this.track.style.transition = 'transform 0.5s ease';
        this.track.style.transform = `translateX(${translateX}px)`;
        this.updateDots();
    }
    
    updateDots() {
        // Update dots based on real slide position
        const realSlideIndex = this.getRealSlideIndex();
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === realSlideIndex);
        });
        
        // Update album cards
        this.albumCards.forEach((card, index) => {
            card.classList.toggle('active', index === realSlideIndex);
        });
    }
    
    getRealSlideIndex() {
        // Convert current slide to real slide index (0-5)
        return this.currentSlide % this.realSlides;
    }
    
    nextSlide() {
        this.currentSlide++;
        if (this.currentSlide >= this.realSlides) { // When reaching the end of first set
            this.updateCarousel();
            // Reset to beginning after transition
            setTimeout(() => {
                this.track.style.transition = 'none';
                this.currentSlide = 0;
                this.track.style.transform = `translateX(${this.centerOffset + (-this.currentSlide * this.slideWidth)}px)`;
                setTimeout(() => {
                    this.track.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500);
        } else {
            this.updateCarousel();
        }
    }
    
    prevSlide() {
        this.currentSlide--;
        if (this.currentSlide < 0) { // When going before the beginning
            this.track.style.transition = 'none';
            this.currentSlide = this.realSlides - 1;
            this.track.style.transform = `translateX(${this.centerOffset + (-this.currentSlide * this.slideWidth)}px)`;
            setTimeout(() => {
                this.track.style.transition = 'transform 0.5s ease';
            }, 50);
        } else {
            this.updateCarousel();
        }
    }
    

    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
        
        // Pause on hover
        const carousel = document.querySelector('.music-carousel');
        carousel?.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });
        
        carousel?.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicCarousel();
});



// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Create special 2-tone effect
    document.body.style.animation = 'rainbow 2s ease-in-out';
    showNotification('🎉 2 TONE ACTIVATED! The Specials live on!');
    
    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            25% { filter: hue-rotate(90deg); }
            50% { filter: hue-rotate(180deg); }
            75% { filter: hue-rotate(270deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.animation = 'none';
        style.remove();
    }, 2000);
}

// Loading Animation
window.addEventListener('load', () => {
    // Create loading screen
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-checkerboard"></div>
        </div>
    `;
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease;
    `;
    
    const loaderContent = loader.querySelector('.loader-content');
    loaderContent.style.cssText = `
        text-align: center;
        font-family: 'Bebas Neue', sans-serif;
        letter-spacing: 3px;
    `;
    
    const loaderCheckerboard = loader.querySelector('.loader-checkerboard');
    loaderCheckerboard.style.cssText = `
        width: 100px;
        height: 100px;
        margin: 0 auto 30px;
        background-image: url('./assets/vinyl.svg');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        animation: spin 1s linear infinite;
    `;
    
    // Add spin animation
    const spinStyle = document.createElement('style');
    spinStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(spinStyle);
    
    document.body.appendChild(loader);
    
    // Remove loader after 1.5 seconds
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
            spinStyle.remove();
        }, 500);
    }, 1500);
});

// Mobile navigation styles are now handled by styles.css

console.log('🎵 FRANS 🎵');


// Spotify Carousel functionality
let spotifyCurrentSlide = 0;
const spotifyTotalSlides = 8;
const spotifyTotalItems = 16; // Total items including duplicates

function getSpotifyEmbedWidth() {
    if (window.innerWidth <= 480) {
        return 320; // No gap on mobile
    } else if (window.innerWidth <= 768) {
        return 350; // No gap on mobile
    } else {
        return 382; // 350px + 32px gap for desktop
    }
}

function updateSpotifyCarousel(instant = false) {
    const track = document.querySelector('.spotify-embeds-row');
    const embedWidth = getSpotifyEmbedWidth();
    const translateX = -spotifyCurrentSlide * embedWidth;
    
    if (instant) {
        track.style.transition = 'none';
    } else {
        track.style.transition = 'transform 0.3s ease';
    }
    
    track.style.transform = `translateX(${translateX}px)`;
    
    // Update dots to show the correct active state (only for original 8 slides)
    const dotIndex = spotifyCurrentSlide % spotifyTotalSlides;
    document.querySelectorAll('.spotify-carousel .dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === dotIndex);
    });
    
    // Handle infinite loop
    if (spotifyCurrentSlide >= spotifyTotalSlides) {
        setTimeout(() => {
            spotifyCurrentSlide = 0;
            updateSpotifyCarousel(true);
        }, 300);
    } else if (spotifyCurrentSlide < 0) {
        setTimeout(() => {
            spotifyCurrentSlide = spotifyTotalSlides - 1;
            updateSpotifyCarousel(true);
        }, 300);
    }
}

// Main carousel navigation
document.getElementById('spotifyNextBtn')?.addEventListener('click', () => {
    spotifyCurrentSlide++;
    updateSpotifyCarousel();
});

document.getElementById('spotifyPrevBtn')?.addEventListener('click', () => {
    spotifyCurrentSlide--;
    updateSpotifyCarousel();
});

// Mini buttons navigation
document.getElementById('miniNextBtn')?.addEventListener('click', () => {
    spotifyCurrentSlide++;
    updateSpotifyCarousel();
});

document.getElementById('miniPrevBtn')?.addEventListener('click', () => {
    spotifyCurrentSlide--;
    updateSpotifyCarousel();
});

// Dot navigation
document.querySelectorAll('.spotify-carousel .dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
        spotifyCurrentSlide = index;
        updateSpotifyCarousel();
    });
});

// Add window resize listener to update carousel on screen size change
window.addEventListener('resize', () => {
    updateSpotifyCarousel();
});
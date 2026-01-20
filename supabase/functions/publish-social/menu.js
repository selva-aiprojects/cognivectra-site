// Hamburger Menu Functionality for Navbar.jsx
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    const mobileLinks = document.querySelectorAll('.mobile-nav a, .mobile-menu a');
    const closeBtn = document.querySelector('.mobile-close-btn');

    // Check if elements exist
    if (!hamburger || !mobileMenu) {
        console.warn('Hamburger menu elements not found. Make sure you have the correct HTML structure.');
        return;
    }

    // Toggle Menu Function
    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        if (mobileOverlay) mobileOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');

        // Toggle aria-expanded for accessibility
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);

        // Prevent scrolling when menu is open
        if (isExpanded) {
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
        }
    }

    // Close Menu Function
    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.documentElement.style.overflow = '';
    }

    // Open Menu Function
    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.documentElement.style.overflow = 'hidden';
    }

    // Initialize hamburger button
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobile-menu');

    // Initialize mobile menu
    mobileMenu.setAttribute('id', 'mobile-menu');
    mobileMenu.setAttribute('aria-label', 'Mobile navigation menu');
    mobileMenu.setAttribute('aria-hidden', 'true');

    // Toggle Menu on Hamburger Click
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();

        // Update aria-hidden for mobile menu
        const isHidden = !mobileMenu.classList.contains('active');
        mobileMenu.setAttribute('aria-hidden', isHidden);
    });

    // Close Menu on Overlay Click
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMenu);
    }

    // Close Menu on Close Button Click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // Close Menu on Link Click (for navigation)
    mobileLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // If it's an anchor link, close menu after delay
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');

                closeMenu();

                // Smooth scroll to target after menu closes
                setTimeout(() => {
                    if (targetId !== '#') {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            window.scrollTo({
                                top: targetElement.offsetTop - 100,
                                behavior: 'smooth'
                            });
                        }
                    }
                }, 300);
            } else {
                // For regular links, just close the menu
                setTimeout(closeMenu, 300);
            }
        });
    });

    // Close Menu on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close Menu when clicking outside (only on desktop if needed)
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Handle window resize - close menu on tablet/desktop
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth >= 769 && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });

    // Smooth scroll for all anchor links (optional enhancement)
    document.querySelectorAll('a[href^="#"]:not(.mobile-nav a, .mobile-menu a)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close menu if open
                if (mobileMenu.classList.contains('active')) {
                    closeMenu();
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }, 300);
                } else {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add focus trap for accessibility (optional)
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function (e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        });
    }

    // Initialize focus trap if menu exists
    trapFocus(mobileMenu);
});

// Optional: Add scroll behavior for navbar
let lastScrollTop = 0;
const navbar = document.querySelector('.nav');

window.addEventListener('scroll', function () {
    if (!navbar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.classList.add('scrolled');

        // Optional: Hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
});
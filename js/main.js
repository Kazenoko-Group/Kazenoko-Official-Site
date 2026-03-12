document.addEventListener('DOMContentLoaded', () => {

    // --- 0. IxD Init: Custom Cursor ---
    const cursorDot = document.createElement('div');
    cursorDot.id = 'cursor-dot';
    const cursorOutline = document.createElement('div');
    cursorOutline.id = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Scroll Progress Bar
    const scrollProgress = document.createElement('div');
    scrollProgress.id = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isHovering = false;
    let targetEl = null;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant update for dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Click effect
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-active'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-active'));

    // Smooth follow for outline with magnetic effect
    const animateCursor = () => {
        let targetX = mouseX;
        let targetY = mouseY;

        if (isHovering && targetEl) {
            const rect = targetEl.getBoundingClientRect();
            // Magnetic snap to center if it has 'cursor-snap' class
            if (targetEl.classList.contains('cursor-snap')) {
                targetX = rect.left + rect.width / 2;
                targetY = rect.top + rect.height / 2;
            }
        }

        const dx = targetX - cursorX;
        const dy = targetY - cursorY;

        cursorX += dx * 0.15;
        cursorY += dy * 0.15;

        cursorOutline.style.left = `${cursorX}px`;
        cursorOutline.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover interactions
    const updateInteractiveElements = () => {
        const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer, input, textarea, .hover-trigger');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                document.body.classList.add('hovering');
                isHovering = true;
                targetEl = e.currentTarget;
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
                isHovering = false;
                targetEl = null;
            });
        });
    };
    updateInteractiveElements();

    // Scroll progress indicator
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";
    });


    // --- 1. Initialize Overlay ---
    const overlay = document.getElementById('transition-overlay');

    // Determine entrance animation (slide out)
    if (overlay) {
        // Wait a tiny bit to ensure the browser has painted the initial state (covering)
        setTimeout(() => {
            overlay.classList.add('overlay-hidden');
        }, 100);
    }

    // --- 2. Setup Navigation Links ---
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');

        // Skip external links or anchors
        if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = href;
            const transitionColor = link.getAttribute('data-transition-color') || '#000';

            // Start Exit Animation
            if (overlay) {
                // Set overlay color for the exit
                overlay.style.backgroundColor = transitionColor;

                // Remove hidden class to slide it back in (cover screen)
                overlay.classList.remove('overlay-hidden');

                // Wait for animation then navigate
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 700); // Match CSS duration
            } else {
                window.location.href = targetUrl;
            }
        });
    });

    // --- 3. Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, we can stop observing if we want it to stay
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .reveal-text');
    animatedElements.forEach(el => observer.observe(el));


    // Premium Opening Animation V2
    const opening = document.getElementById('opening-overlay');
    const body = document.body;

    if (opening) {
        // Prevent scrolling during opening
        body.classList.add('overflow-hidden');

        const chars = document.querySelectorAll('.opening-char');
        const content = document.getElementById('opening-content');

        // 1. Stagger letters in
        setTimeout(() => {
            chars.forEach((char, index) => {
                setTimeout(() => {
                    char.classList.add('char-visible');
                }, index * 60); // Stagger by 60ms
            });
        }, 300);

        // 2. Split and zoom out
        setTimeout(() => {
            content.classList.add('opening-zoom-out');
            opening.classList.add('opening-split-open');
            body.classList.remove('overflow-hidden');

            // Trigger fade-in elements sequentially
            const fadeElements = document.querySelectorAll('.fade-in-up');
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                    el.style.opacity = '';
                    el.style.transform = '';
                }, index * 150);
            });
        }, 1200);

        // 3. Remove from DOM
        setTimeout(() => {
            opening.remove();
        }, 2400);
    }

    // --- 4. Magnetic Buttons (IxD) ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn'); // Add this class to desired elements

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move element slightly towards mouse
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 5. Parallax Background (IxD) ---
    // Uses individual `translate` property to avoid overriding CSS `transform` animations
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    if (parallaxLayers.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed') || 1;
                const xPos = x * speed;
                const yPos = y * speed;
                layer.style.translate = `${xPos}px ${yPos}px`;
            });
        });
    }

    // Removed Typewriter Effect (Terminal-like animations are banned)

});

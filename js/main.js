document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. IxD Init: Custom Cursor ---
    const cursorDot = document.createElement('div');
    cursorDot.id = 'cursor-dot';
    const cursorOutline = document.createElement('div');
    cursorOutline.id = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant update for dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth follow for outline
    const animateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15; // Lag factor
        cursorY += dy * 0.15;
        
        cursorOutline.style.left = `${cursorX}px`;
        cursorOutline.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover interactions
    const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
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
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.fade-in-up, .reveal-text');
    animatedElements.forEach(el => observer.observe(el));


    // --- 4. Magnetic Buttons (IxD) ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn'); // Add this class to desired elements
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move element slightly towards mouse
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 5. Parallax Background (IxD) ---
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    if (parallaxLayers.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed') || 1;
                const xPos = x * speed;
                const yPos = y * speed;
                layer.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        });
    }

});

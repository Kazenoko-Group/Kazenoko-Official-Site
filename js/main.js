const INTERACTIVE_SELECTOR = 'a, button, .cursor-pointer, input, textarea, .hover-trigger';
const ANIMATED_SELECTOR = '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .reveal-text';

function createAppendedElement(id) {
    const element = document.createElement('div');
    element.id = id;
    document.body.appendChild(element);
    return element;
}

function initializeCursor(body) {
    const cursorDot = createAppendedElement('cursor-dot');
    const cursorOutline = createAppendedElement('cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let targetEl = null;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    document.addEventListener('mousedown', () => body.classList.add('cursor-active'));
    document.addEventListener('mouseup', () => body.classList.remove('cursor-active'));

    document.querySelectorAll(INTERACTIVE_SELECTOR).forEach((element) => {
        element.addEventListener('mouseenter', (event) => {
            body.classList.add('hovering');
            targetEl = event.currentTarget;
        });

        element.addEventListener('mouseleave', () => {
            body.classList.remove('hovering');
            targetEl = null;
        });
    });

    const animateCursor = () => {
        let targetX = mouseX;
        let targetY = mouseY;

        if (targetEl?.classList.contains('cursor-snap')) {
            const rect = targetEl.getBoundingClientRect();
            targetX = rect.left + rect.width / 2;
            targetY = rect.top + rect.height / 2;
        }

        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;

        cursorOutline.style.left = `${cursorX}px`;
        cursorOutline.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    };

    animateCursor();
}

function initializeScrollProgress() {
    const scrollProgress = createAppendedElement('scroll-progress');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        scrollProgress.style.width = `${scrolled}%`;
    });
}

function initializePageTransition(overlay) {
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('overlay-hidden');
        }, 100);
    }

    document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');

        if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') {
            return;
        }

        link.addEventListener('click', (event) => {
            event.preventDefault();

            if (!overlay) {
                window.location.href = href;
                return;
            }

            overlay.style.backgroundColor = link.getAttribute('data-transition-color') || '#000';
            overlay.classList.remove('overlay-hidden');

            setTimeout(() => {
                window.location.href = href;
            }, 700);
        });
    });
}

function initializeRevealAnimations() {
    const animatedElements = document.querySelectorAll(ANIMATED_SELECTOR);

    if (animatedElements.length === 0) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach((element) => observer.observe(element));
}

function initializeOpeningAnimation(body) {
    const opening = document.getElementById('opening-overlay');
    const content = document.getElementById('opening-content');

    if (!opening || !content) {
        return;
    }

    body.classList.add('overflow-hidden');

    const chars = document.querySelectorAll('.opening-char');
    const fadeElements = document.querySelectorAll('.fade-in-up');

    setTimeout(() => {
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.classList.add('char-visible');
            }, index * 60);
        });
    }, 300);

    setTimeout(() => {
        content.classList.add('opening-zoom-out');
        opening.classList.add('opening-split-open');
        body.classList.remove('overflow-hidden');

        fadeElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
                element.style.opacity = '';
                element.style.transform = '';
            }, index * 150);
        });
    }, 1200);

    setTimeout(() => {
        opening.remove();
    }, 2400);
}

function initializeMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach((button) => {
        button.addEventListener('mousemove', (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0px, 0px)';
        });
    });
}

function initializeParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    if (parallaxLayers.length === 0) {
        return;
    }

    document.addEventListener('mousemove', (event) => {
        const x = (window.innerWidth - event.pageX * 2) / 100;
        const y = (window.innerHeight - event.pageY * 2) / 100;

        parallaxLayers.forEach((layer) => {
            const speed = Number(layer.getAttribute('data-speed') || 1);
            layer.style.translate = `${x * speed}px ${y * speed}px`;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const overlay = document.getElementById('transition-overlay');

    initializeCursor(body);
    initializeScrollProgress();
    initializePageTransition(overlay);
    initializeRevealAnimations();
    initializeOpeningAnimation(body);
    initializeMagneticButtons();
    initializeParallax();
});

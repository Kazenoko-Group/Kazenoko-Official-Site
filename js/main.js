// Initialize Lucide Icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking backdrop
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (prefersReducedMotion) observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        if (prefersReducedMotion) {
            el.classList.add('active');
            return;
        }
        observer.observe(el);
    });

    const charRevealElements = document.querySelectorAll('.char-reveal');
    charRevealElements.forEach(el => {
        const parts = el.innerHTML.split(/(<br\s*\/?>)/gi);
        let charIndex = 0;
        
        el.innerHTML = parts.map(part => {
            if (part.match(/<br\s*\/?>/i)) return part;
            
            return part.split('').map(char => {
                if (char.trim() === '') return char;
                
                const span = `<span style="transition-delay: ${charIndex * 0.05}s">${char}</span>`;
                charIndex++;
                return span;
            }).join('');
        }).join('');
        
        if (prefersReducedMotion) {
            el.classList.add('active');
            return;
        }
        observer.observe(el);
    });

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const formatNumber = value => value.toLocaleString('ja-JP');

    const startCountUp = el => {
        const from = Number(el.dataset.countFrom ?? '0');
        const to = Number(el.dataset.countTo ?? '0');
        const duration = Number(el.dataset.countDuration ?? '1200');
        const prefix = el.dataset.countPrefix ?? '';
        const suffix = el.dataset.countSuffix ?? '';

        let startTime = null;
        el.textContent = `${prefix}${formatNumber(from)}${suffix}`;

        const tick = now => {
            if (startTime === null) startTime = now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = Math.round(from + (to - from) * eased);
            el.textContent = `${prefix}${formatNumber(current)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    const countupElements = document.querySelectorAll('[data-count-to]');
    if (countupElements.length) {
        if (prefersReducedMotion) {
            countupElements.forEach(el => {
                const to = Number(el.dataset.countTo ?? '0');
                const prefix = el.dataset.countPrefix ?? '';
                const suffix = el.dataset.countSuffix ?? '';
                el.textContent = `${prefix}${formatNumber(to)}${suffix}`;
            });
        } else {
            const countObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    startCountUp(entry.target);
                    countObserver.unobserve(entry.target);
                });
            }, { threshold: 0.6 });

            countupElements.forEach(el => countObserver.observe(el));
        }
    }
});

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (scrollY > 50) {
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('shadow-sm');
        }
    }

    const heroBg = document.querySelector('.hero-bg-animate');
    if (heroBg) {
        heroBg.style.transform = `scale(${1 + scrollY * 0.0005}) translateY(${scrollY * 0.5}px)`;
    }
});

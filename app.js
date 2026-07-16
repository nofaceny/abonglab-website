// ===== ABONGLAB APP PAGES: shared interactivity (no dependencies) =====
// Used by digsy/index.html and pigeon/index.html.

(function () {
    'use strict';

    // ----- Sticky nav scrolled state -----
    const nav = document.querySelector('.app-nav');
    if (nav) {
        const updateNav = () => {
            nav.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        updateNav();
        window.addEventListener('scroll', updateNav, { passive: true });
    }

    // ----- Scroll reveal via IntersectionObserver -----
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            revealEls.forEach((el) => observer.observe(el));
        } else {
            revealEls.forEach((el) => el.classList.add('is-visible'));
        }
    }

    // ----- FAQ accordion -----
    document.querySelectorAll('.faq-item').forEach((item) => {
        const question = item.querySelector('.faq-item__q');
        const answer = item.querySelector('.faq-item__a');
        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isOpen = item.getAttribute('data-open') === 'true';

            document.querySelectorAll('.faq-item[data-open="true"]').forEach((openItem) => {
                if (openItem !== item) {
                    openItem.setAttribute('data-open', 'false');
                    openItem.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
                    openItem.querySelector('.faq-item__a').style.maxHeight = null;
                }
            });

            if (isOpen) {
                item.setAttribute('data-open', 'false');
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                item.setAttribute('data-open', 'true');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ----- Phone mockup tilt / parallax -----
    const stage = document.querySelector('.phone-stage');
    const phone = document.querySelector('.phone');
    if (stage && phone && window.matchMedia('(hover: hover)').matches) {
        stage.addEventListener('mousemove', (e) => {
            const rect = stage.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotateY = x * -14 - 8;
            const rotateX = y * 10 + 2;
            phone.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });

        stage.addEventListener('mouseleave', () => {
            phone.style.transform = 'rotateY(-8deg) rotateX(2deg)';
        });
    }

    // ----- Smooth scroll for in-page anchors -----
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, '', targetId);
            }
        });
    });
})();

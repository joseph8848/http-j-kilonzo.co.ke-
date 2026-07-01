/* ============================================================
   JLM Media & Sound Services — Main JS
   Scroll reveal · counters · mobile nav · filters · lightbox
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Scroll reveal ---------- */
    const revealEls = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .slide-in');
    if (revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0)';
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach((el) => {
            const delay = el.style.getPropertyValue('--delay') || '0s';
            el.style.transition = `opacity .7s var(--ease, ease) ${delay}, transform .7s var(--ease, ease) ${delay}`;
            if (el.classList.contains('fade-in-up')) el.style.transform = 'translateY(36px)';
            else if (el.classList.contains('fade-in-left')) el.style.transform = 'translateX(-36px)';
            else if (el.classList.contains('fade-in-right')) el.style.transform = 'translateX(36px)';
            else if (el.classList.contains('slide-in')) el.style.transform = 'translateY(28px)';
            io.observe(el);
        });
    }

    /* ---------- Animated counters ---------- */
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const run = (el) => {
            const target = +el.getAttribute('data-target');
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1500;
            const start = performance.now();
            const tick = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(eased * target) + (p === 1 ? suffix : '');
                if (p < 1) requestAnimationFrame(tick);
                else el.textContent = target + suffix;
            };
            requestAnimationFrame(tick);
        };
        const co = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { run(e.target); co.unobserve(e.target); }
            });
        }, { threshold: 0.5 });
        counters.forEach((c) => co.observe(c));
    }

    /* ---------- Sticky header state ---------- */
    const header = document.getElementById('siteHeader');
    if (header) {
        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Mobile nav ---------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        const toggle = (open) => {
            const isOpen = open !== undefined ? open : !navMenu.classList.contains('active');
            navMenu.classList.toggle('active', isOpen);
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };
        hamburger.addEventListener('click', () => toggle());
        navMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
    }

    /* ---------- Filtering (gallery + catalog) ---------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('[data-category]');
    if (filterButtons.length && filterItems.length) {
        filterItems.forEach((item) => { item.style.transition = 'opacity .35s var(--ease), transform .35s var(--ease)'; });
        filterButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterButtons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                filterItems.forEach((item) => {
                    const cat = item.getAttribute('data-category') || '';
                    const show = filter === 'all' || cat.split(/\s+/).includes(filter);
                    if (show) {
                        item.style.display = '';
                        requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; });
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(.92)';
                        setTimeout(() => { item.style.display = 'none'; }, 320);
                    }
                });
            });
        });
    }

    /* ---------- Lightbox (real images) ---------- */
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lbImg = document.getElementById('lightbox-img');
        const lbTitle = document.getElementById('lightbox-title');
        const lbDesc = document.getElementById('lightbox-description');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        const open = (src, title, desc) => {
            if (lbImg && src) { lbImg.src = src; lbImg.alt = title || ''; }
            if (lbTitle) lbTitle.textContent = title || '';
            if (lbDesc) lbDesc.textContent = desc || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        const close = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };

        document.querySelectorAll('[data-lightbox]').forEach((el) => {
            el.addEventListener('click', () => {
                open(el.getAttribute('data-img'), el.getAttribute('data-title'), el.getAttribute('data-desc'));
            });
        });
        if (closeBtn) closeBtn.addEventListener('click', close);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) close(); });
    }

    /* ---------- Smooth scroll for in-page anchors ---------- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ---------- Dynamic footer year ---------- */
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

    /* ---------- Booking form validation ---------- */
    const form = document.getElementById('bookingForm');
    if (form) {
        const setError = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg || ''; };
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let ok = true;
            document.querySelectorAll('.error-message').forEach((el) => (el.textContent = ''));

            const name = document.getElementById('name');
            if (name && !name.value.trim()) { setError('nameError', 'Please enter your name'); ok = false; }

            const email = document.getElementById('email');
            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && (!email.value.trim() || !emailRe.test(email.value))) { setError('emailError', 'Please enter a valid email'); ok = false; }

            const phone = document.getElementById('phone');
            if (phone && !phone.value.trim()) { setError('phoneError', 'Please enter your phone number'); ok = false; }

            const eventType = document.getElementById('eventType');
            if (eventType && !eventType.value) { setError('eventTypeError', 'Please select an event type'); ok = false; }

            const eventDate = document.getElementById('eventDate');
            if (eventDate && !eventDate.value) { setError('eventDateError', 'Please select a date'); ok = false; }

            const services = document.querySelectorAll('input[name="services"]:checked');
            if (document.querySelector('input[name="services"]') && services.length === 0) { setError('servicesError', 'Select at least one service'); ok = false; }

            if (ok) {
                const status = document.getElementById('formStatus');
                if (status) {
                    status.innerHTML = '<div class="success-message">✓ Thank you! Your booking request has been received. We\'ll contact you within 24 hours.</div>';
                    status.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                form.reset();
                setTimeout(() => { if (status) status.innerHTML = ''; }, 8000);
            }
        });
    }
})();

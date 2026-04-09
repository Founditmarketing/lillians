/* ============================================
   LILLIAN'S INTERIORS — Interactive Engine
   Progressive Enhancement: content visible by default,
   animations activate only when JS loads successfully.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Mark JS as loaded (enables CSS animations) ──
    document.body.classList.add('js-loaded');

    // ── Dynamic Copyright Year ──
    const yearEl = document.getElementById('copyrightYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Preloader ──
    const preloader = document.getElementById('preloader');
    const heroBgImg = document.getElementById('heroBgImg');

    function dismissPreloader() {
        if (preloader) preloader.classList.add('hidden');
        if (heroBgImg) heroBgImg.classList.add('loaded');
        initRevealAnimations();
    }

    // Dismiss on load, with fallback timeout
    if (document.readyState === 'complete') {
        setTimeout(dismissPreloader, 800);
    } else {
        window.addEventListener('load', () => setTimeout(dismissPreloader, 1200));
    }
    // Hard fallback — never block user longer than 3s
    setTimeout(dismissPreloader, 3000);

    // ── Custom Cursor (desktop only, feature-detected) ──
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isDesktop) {
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        document.querySelectorAll('a, button, .magnetic').forEach(el => {
            el.addEventListener('mouseenter', () => ring && ring.classList.add('hovering'));
            el.addEventListener('mouseleave', () => ring && ring.classList.remove('hovering'));
        });
    }

    // ── Navigation Scroll ──
    const nav = document.getElementById('mainNav');

    function handleNavScroll() {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // check initial state

    // ── Mobile Menu ──
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ── Smooth Scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const y = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // ── Reveal Animations (Intersection Observer) ──
    // Respects prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal-up');

        if (prefersReducedMotion) {
            // Skip animations entirely — make everything visible
            reveals.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    // ── Animated Counters ──
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        if (prefersReducedMotion) {
            el.textContent = target.toLocaleString();
            return;
        }
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ── Hero Parallax (only if no reduced motion) ──
    if (!prefersReducedMotion && heroBgImg) {
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                const offset = window.scrollY * 0.35;
                heroBgImg.style.transform = `scale(1) translateY(${offset}px)`;
            }
        }, { passive: true });
    }

    // ── Services Carousel — Drag/Touch Support ──
    const carousel = document.getElementById('servicesCarousel');
    if (carousel) {
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        // Mouse drag
        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.cursor = 'grabbing';
        });
        carousel.addEventListener('mouseleave', () => {
            isDragging = false;
            carousel.style.cursor = 'grab';
        });
        carousel.addEventListener('mouseup', () => {
            isDragging = false;
            carousel.style.cursor = 'grab';
        });
        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.5;
            carousel.scrollLeft = scrollLeft - walk;
        });

        // Touch swipe (native scroll works, but this prevents click conflicts)
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollLeft = carousel.scrollLeft;
        }, { passive: true });
        carousel.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX;
            const walk = (startX - x) * 1.2;
            carousel.scrollLeft = scrollLeft + walk;
        }, { passive: true });
    }

    // ── Portfolio Filter ──
    const filterBtns = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hiding');
                    item.style.display = '';
                } else {
                    item.classList.add('hiding');
                    setTimeout(() => {
                        if (item.classList.contains('hiding')) {
                            item.style.display = 'none';
                        }
                    }, 500);
                }
            });
        });
    });

    // ── Lightbox ──
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxInfo = document.getElementById('lightboxInfo');

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.portfolio-item-btn, .portfolio-item-inner img').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const item = e.target.closest('.portfolio-item');
                if (!item) return;
                const img = item.querySelector('img');
                const category = item.querySelector('.portfolio-item-category');
                const title = item.querySelector('.portfolio-item-title');
                const desc = item.querySelector('.portfolio-item-desc');

                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxInfo.querySelector('.lightbox-category').textContent = category ? category.textContent : '';
                lightboxInfo.querySelector('.lightbox-title').textContent = title ? title.textContent : '';
                lightboxInfo.querySelector('.lightbox-desc').textContent = desc ? desc.textContent : '';

                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ── Testimonial Carousel with Touch Support ──
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    let currentSlide = 0;
    let autoPlayTimer;

    if (slides.length > 0) {
        function goToSlide(idx) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            currentSlide = (idx + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoPlay(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoPlay(); });
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => { goToSlide(i); resetAutoPlay(); });
        });

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
        }
        resetAutoPlay();

        // Touch swipe on testimonials
        const testimonialCarousel = document.getElementById('testimonialsCarousel');
        if (testimonialCarousel) {
            let touchStartX = 0;
            let touchEndX = 0;

            testimonialCarousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            testimonialCarousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        goToSlide(currentSlide + 1); // swipe left = next
                    } else {
                        goToSlide(currentSlide - 1); // swipe right = prev
                    }
                    resetAutoPlay();
                }
            }, { passive: true });
        }
    }

    // ── Process Timeline Scroll Progress ──
    const processLine = document.getElementById('processLine');
    const processSteps = document.querySelectorAll('.process-step');

    if (processLine && processSteps.length > 0) {
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.5 });

        processSteps.forEach(step => stepObserver.observe(step));

        if (!prefersReducedMotion) {
            window.addEventListener('scroll', () => {
                const section = document.getElementById('process');
                if (!section) return;
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top;
                const sectionHeight = rect.height;
                const windowH = window.innerHeight;
                const progress = Math.min(Math.max((windowH - sectionTop) / (sectionHeight + windowH * 0.5), 0), 1);
                processLine.style.background = `linear-gradient(to bottom, var(--color-blush) ${progress * 100}%, var(--color-champagne) ${progress * 100}%)`;
            }, { passive: true });
        }
    }

    // ── Magnetic Buttons (desktop only) ──
    if (isDesktop && !prefersReducedMotion) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ── Contact Form ──
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('formSubmitBtn');
            const btnText = btn.querySelector('span');
            const original = btnText.textContent;
            btnText.textContent = 'Message Sent!';
            btn.style.background = 'var(--color-sage)';
            btn.disabled = true;
            setTimeout(() => {
                btnText.textContent = original;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    // ── Scroll Indicator Fade ──
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            scrollIndicator.style.opacity = Math.max(0, 1 - window.scrollY / 300);
        }, { passive: true });
    }
    // ── Mobile Sticky CTA Bar ──
    const mobileCta = document.getElementById('mobileCta');
    if (mobileCta) {
        const heroEl = document.getElementById('hero');
        const contactEl = document.getElementById('contact');
        
        window.addEventListener('scroll', () => {
            const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : 600;
            const contactTop = contactEl ? contactEl.offsetTop - window.innerHeight : Infinity;
            const scrollY = window.scrollY;
            
            if (scrollY > heroBottom && scrollY < contactTop) {
                mobileCta.classList.add('visible');
            } else {
                mobileCta.classList.remove('visible');
            }
        }, { passive: true });
    }

});

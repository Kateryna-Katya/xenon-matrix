document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. НАСТРОЙКА БИБЛИОТЕК (Безопасный старт)
    // ==========================================
    
    // Иконки
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // GSAP Check
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP Critical Error: Libraries not loaded.");
        // Если GSAP не загрузился, делаем элементы видимыми, чтобы сайт не был пустым
        document.querySelectorAll('.card, .blog-card, .hero__title, .hero__desc').forEach(el => el.style.opacity = 1);
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Lenis (Плавный скролл)
    if (typeof Lenis !== 'undefined') {
        try {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
            });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } catch (e) { console.warn('Lenis init error:', e); }
    }

    // ==========================================
    // 2. МОБИЛЬНОЕ МЕНЮ
    // ==========================================
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('is-active');
                mobileMenu.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // ==========================================
    // 3. АНИМАЦИИ (НОВЫЙ ПОДХОД С BATCH)
    // ==========================================
    
    // Функция для безопасного выбора элементов
    const q = (selector) => document.querySelector(selector);
    const qa = (selector) => document.querySelectorAll(selector);

    // --- A. HERO SECTION (Одиночные элементы) ---
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if(q('.hero__title')) heroTl.from('.hero__title', { y: 60, opacity: 0, duration: 1, delay: 0.2 });
    if(q('.hero__desc'))  heroTl.from('.hero__desc', { y: 30, opacity: 0, duration: 0.8 }, "-=0.6");
    if(q('.hero__btns'))  heroTl.from('.hero__btns', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");
    if(q('.cube-wrapper')) heroTl.from('.cube-wrapper', { scale: 0, opacity: 0, rotation: 180, duration: 1.5, ease: "elastic.out(1,0.5)" }, "-=1");

    // --- B. ЗАГОЛОВКИ СЕКЦИЙ ---
    qa('.section__header').forEach(header => {
        gsap.from(header.children, {
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2
        });
    });

    // --- C. СПИСКИ КАРТОЧЕК (ИСПРАВЛЕНИЕ: BATCH) ---
    // Этот метод гарантированно анимирует все элементы, даже если их много или они сложены вертикально.
    
    // 1. Экспертиза и Блог (Карточки)
    ScrollTrigger.batch(".expertise .card, .blog-card", {
        start: "top 85%", // Начинаем, когда верх элемента на 85% высоты экрана
        onEnter: batch => gsap.from(batch, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.15, // Задержка между элементами в одной "пачке"
            ease: "power2.out",
            overwrite: true
        }),
        once: true // Анимировать только один раз
    });

    // 2. Инновации (Список галочек)
    ScrollTrigger.batch(".innovation__list li", {
        start: "top 90%",
        onEnter: batch => gsap.from(batch, {
            opacity: 0,
            x: -20,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            overwrite: true
        }),
        once: true
    });

    // 3. Контакты (Иконки)
    ScrollTrigger.batch(".contact__item", {
        start: "top 90%",
        onEnter: batch => gsap.from(batch, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.1,
            overwrite: true
        }),
        once: true
    });

    // Одиночные элементы в секциях
    if(q('.innovation__image')) {
        gsap.from('.innovation__image', {
            scrollTrigger: { trigger: '.innovation', start: "top 75%" },
            scale: 0.9, opacity: 0, duration: 1
        });
    }
    if(q('.form')) {
        gsap.from('.form', {
            scrollTrigger: { trigger: '.contact', start: "top 75%" },
            x: 50, opacity: 0, duration: 0.8
        });
    }

    // ==========================================
    // 4. ФОРМА И КУКИ (Без изменений)
    // ==========================================
    const form = document.getElementById('contactForm');
    if (form) {
        const num1 = Math.floor(Math.random() * 5) + 1;
        const num2 = Math.floor(Math.random() * 5) + 1;
        const result = num1 + num2;
        if(q('#captchaTask')) q('#captchaTask').textContent = `${num1} + ${num2}`;

        if(q('#phone')) q('#phone').addEventListener('input', (e) => e.target.value = e.target.value.replace(/\D/g, ''));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (parseInt(q('#captcha').value) !== result) {
                alert('Неверное решение! Попробуйте еще раз.'); return;
            }
            const btn = form.querySelector('button');
            btn.textContent = 'Отправлено!';
            btn.style.background = '#D9F99D'; btn.style.color = '#111';
            setTimeout(() => {
                form.style.display = 'none';
                q('#formSuccess').style.display = 'block';
                form.reset();
            }, 1000);
        });
    }

    const cookiePopup = document.getElementById('cookiePopup');
    if (cookiePopup && !localStorage.getItem('cookieAccepted')) {
        setTimeout(() => cookiePopup.classList.add('is-visible'), 2500);
        q('#acceptCookie').addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookiePopup.classList.remove('is-visible');
        });
    }
});
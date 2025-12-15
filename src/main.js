document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. НАСТРОЙКА БИБЛИОТЕК
    // ==========================================
    
    // Иконки
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // GSAP + ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Lenis (Плавный скролл)
    if (typeof Lenis !== 'undefined') {
        try {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
            });
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            // Связка с GSAP
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } catch (e) { console.warn('Lenis error:', e); }
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
    // 3. АНИМАЦИИ (ПО СЕКЦИЯМ)
    // ==========================================
    
    // --- A. HERO SECTION ---
    const heroTl = gsap.timeline();
    // Используем простые селекторы с проверкой
    if(document.querySelector('.hero__title')) 
        heroTl.from('.hero__title', { y: 60, opacity: 0, duration: 1, ease: "power3.out" });
    if(document.querySelector('.hero__desc')) 
        heroTl.from('.hero__desc', { y: 30, opacity: 0, duration: 0.8 }, "-=0.6");
    if(document.querySelector('.hero__btns')) 
        heroTl.from('.hero__btns', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");
    if(document.querySelector('.cube-wrapper')) 
        heroTl.from('.cube-wrapper', { scale: 0, opacity: 0, rotation: 180, duration: 1.5 }, "-=1");


    // --- B. EXPERTISE (Исправление бага "только первый элемент") ---
    // Мы находим ВСЕ карточки внутри секции expertise
    const expertiseCards = document.querySelectorAll('.expertise .card');
    
    if (expertiseCards.length > 0) {
        gsap.from(expertiseCards, {
            scrollTrigger: {
                trigger: '.expertise', // Анимация начнется, когда доскроллим до секции
                start: "top 75%",      // Когда верх секции будет на 75% экрана
            },
            y: 50,           // Сдвиг снизу
            opacity: 0,      // Появление из прозрачности
            duration: 0.8,
            stagger: 0.2,    // Задержка 0.2 сек между карточками (ВАЖНО)
            ease: "power2.out"
        });
    }
    
    // Заголовок экспертизы
    const expTitle = document.querySelector('.expertise .section__header');
    if (expTitle) {
        gsap.from(expTitle, {
            scrollTrigger: { trigger: '.expertise', start: "top 80%" },
            y: 30, opacity: 0, duration: 0.8
        });
    }


    // --- C. INNOVATION ---
    // Список галочек
    const innovList = document.querySelectorAll('.innovation__list li');
    if (innovList.length > 0) {
        gsap.from(innovList, {
            scrollTrigger: { trigger: '.innovation', start: "top 75%" },
            x: -30, opacity: 0, duration: 0.6, stagger: 0.15
        });
    }
    // Картинка справа
    const innovImg = document.querySelector('.innovation__image');
    if (innovImg) {
        gsap.from(innovImg, {
            scrollTrigger: { trigger: '.innovation', start: "top 75%" },
            scale: 0.9, opacity: 0, duration: 1
        });
    }


    // --- D. BLOG ---
    const blogCards = document.querySelectorAll('.blog-card');
    if (blogCards.length > 0) {
        gsap.from(blogCards, {
            scrollTrigger: { trigger: '.blog', start: "top 70%" },
            y: 60, opacity: 0, duration: 0.8, stagger: 0.2
        });
    }


    // --- E. CONTACTS ---
    const contactItems = document.querySelectorAll('.contact__item');
    if (contactItems.length > 0) {
        gsap.from(contactItems, {
            scrollTrigger: { trigger: '.contact', start: "top 80%" },
            y: 20, opacity: 0, duration: 0.6, stagger: 0.1
        });
    }
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        gsap.from(contactForm, {
            scrollTrigger: { trigger: '.contact', start: "top 80%" },
            x: 50, opacity: 0, duration: 0.8
        });
    }

    // ==========================================
    // 4. ФОРМА (Валидация + Капча)
    // ==========================================
    const form = document.getElementById('contactForm');
    
    if (form) {
        // Капча
        const num1 = Math.floor(Math.random() * 5) + 1; // Простые числа 1-5
        const num2 = Math.floor(Math.random() * 5) + 1;
        const result = num1 + num2;
        const captchaLabel = document.getElementById('captchaTask');
        if(captchaLabel) captchaLabel.textContent = `${num1} + ${num2}`;

        // Валидация телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, ''); // Только цифры
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Проверка капчи
            const captchaInput = document.getElementById('captcha');
            if (parseInt(captchaInput.value) !== result) {
                alert('Ошибка в примере! Попробуйте еще раз.');
                captchaInput.value = '';
                return;
            }

            // Успешная отправка
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Отправлено!';
            btn.style.backgroundColor = '#D9F99D'; // Lime color
            btn.style.color = '#111';
            
            setTimeout(() => {
                form.style.display = 'none';
                document.getElementById('formSuccess').style.display = 'block';
                form.reset();
            }, 1000);
        });
    }

    // ==========================================
    // 5. COOKIE
    // ==========================================
    const cookiePopup = document.getElementById('cookiePopup');
    if (cookiePopup && !localStorage.getItem('cookieAccepted')) {
        setTimeout(() => cookiePopup.classList.add('is-visible'), 2500);
        
        document.getElementById('acceptCookie').addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookiePopup.classList.remove('is-visible');
        });
    }
});
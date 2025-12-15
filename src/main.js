document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ИНИЦИАЛИЗАЦИЯ (Icon + Smooth Scroll)
    // ==========================================
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Регистрируем ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Lenis (Плавный скролл)
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

    // Связываем Lenis и GSAP
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // ==========================================
    // 2. АНИМАЦИИ (МЕТОД "КАЖДЫЙ ЗА СЕБЯ")
    // ==========================================
    
    // --- Hero Section ---
    const heroTl = gsap.timeline();
    heroTl.fromTo('.hero__title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2 })
          .fromTo('.hero__desc', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
          .fromTo('.hero__btns', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
          .fromTo('.cube-wrapper', { scale: 0, opacity: 0, rotation: 180 }, { scale: 1, opacity: 1, rotation: 0, duration: 1.5, ease: "elastic.out(1,0.5)" }, "-=1");

    // --- Заголовки секций ---
    document.querySelectorAll('.section__header').forEach(header => {
        gsap.fromTo(header, 
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8,
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%"
                }
            }
        );
    });

    // --- УНИВЕРСАЛЬНЫЙ АНИМАТОР КАРТОЧЕК ---
    // Находим ВСЕ элементы, которые должны всплывать
    const allAnimElements = document.querySelectorAll('.card, .blog-card, .innovation__list li, .contact__item');

    allAnimElements.forEach((el, index) => {
        gsap.fromTo(el, 
            { 
                y: 50, 
                opacity: 0 
            },
            {
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el, // Триггер - это сам элемент
                    start: "top 90%", // Анимация начнется, когда верх элемента появится внизу экрана
                    toggleActions: "play none none reverse" // При скролле вверх анимация проиграется назад (красивый эффект)
                }
            }
        );
    });

    // --- Отдельные элементы ---
    const img = document.querySelector('.innovation__image');
    if(img) {
        gsap.fromTo(img, 
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, scrollTrigger: { trigger: img, start: "top 80%" }}
        );
    }
    
    const formSection = document.querySelector('.form');
    if(formSection) {
        gsap.fromTo(formSection, 
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: formSection, start: "top 80%" }}
        );
    }


    // ==========================================
    // 3. ФУНКЦИОНАЛ (Меню, Форма, Куки)
    // ==========================================
    
    // Мобильное меню
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const links = document.querySelectorAll('.mobile-menu__link');

    if(burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll');
        });
        links.forEach(l => l.addEventListener('click', () => {
            burger.classList.remove('is-active');
            mobileMenu.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
        }));
    }

    // Форма и Капча
    const form = document.getElementById('contactForm');
    if (form) {
        const n1 = Math.floor(Math.random()*5)+1, n2 = Math.floor(Math.random()*5)+1;
        const res = n1 + n2;
        if(document.getElementById('captchaTask')) document.getElementById('captchaTask').textContent = `${n1} + ${n2}`;
        
        // Валидация ввода телефона
        const ph = document.getElementById('phone');
        if(ph) ph.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g,''));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if(parseInt(document.getElementById('captcha').value) !== res) {
                alert('Ошибка капчи!'); return;
            }
            const btn = form.querySelector('button');
            btn.textContent = 'Успешно!';
            btn.style.background = '#D9F99D'; btn.style.color = '#000';
            setTimeout(() => {
                form.style.display='none';
                document.getElementById('formSuccess').style.display='block';
            }, 1000);
        });
    }

    // Cookie
    if(!localStorage.getItem('cookieAccepted')) {
        setTimeout(() => document.getElementById('cookiePopup')?.classList.add('is-visible'), 2000);
        document.getElementById('acceptCookie')?.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            document.getElementById('cookiePopup').classList.remove('is-visible');
        });
    }
});
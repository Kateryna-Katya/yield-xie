document.addEventListener('DOMContentLoaded', () => {
    // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- МОБИЛЬНОЕ МЕНЮ (ИСПРАВЛЕНО) ---
    const burger = document.getElementById('burger-btn');
    const nav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav__link');

    const toggleMenu = (state) => {
        if (state === 'close') {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            const isActive = burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        }
    };

    if (burger && nav) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Закрытие при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu('close'));
        });

        // Закрытие при клике вне меню
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !burger.contains(e.target)) {
                toggleMenu('close');
            }
        });
    }

    // --- HERO: АНИМАЦИЯ ТЕКСТА (БЕЗ РАЗРЫВА СЛОВ) ---
    const title = document.getElementById('hero-title');
    if (title) {
        const text = title.textContent.trim();
        title.textContent = '';
        
        const words = text.split(' ');
        words.forEach((word, wIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word'; // Стили в CSS: display: inline-block; white-space: nowrap;
            
            word.split('').forEach((char, cIdx) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = char;
                // Рассчитываем задержку появления каждой буквы
                charSpan.style.transitionDelay = `${(wIdx * 5 + cIdx) * 0.03}s`;
                wordSpan.appendChild(charSpan);
            });
            title.appendChild(wordSpan);
        });

        // Запуск анимации с небольшой задержкой
        setTimeout(() => {
            document.querySelectorAll('.char').forEach(c => c.classList.add('visible'));
            document.querySelector('.hero__subtitle')?.classList.add('active');
            document.querySelector('.hero__actions')?.classList.add('active');
            document.querySelector('.hero__badge')?.classList.add('active');
        }, 300);
    }

    // --- SVG ПАРАЛЛАКС (HERO BLOB) ---
    const hero = document.getElementById('hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 25;
            const y = (e.clientY / window.innerHeight - 0.5) * 25;
            const blob = document.querySelector('.hero__blob');
            if (blob) blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // --- INTERSECTION OBSERVER (СКРОЛЛ-АНИМАЦИИ) ---
    const scrollOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Отрисовка линии в секции About
                const path = entry.target.querySelector('#growth-path');
                if (path) path.classList.add('draw-path');

                // Появление подписей инфографики
                const labels = entry.target.querySelectorAll('.infographic__label');
                labels.forEach((label, i) => {
                    setTimeout(() => label.style.opacity = '1', 600 + (i * 300));
                });
            }
        });
    }, scrollOptions);

    document.querySelectorAll('section, .animate-on-scroll, .benefit-card').forEach(el => {
        observer.observe(el);
    });

    // --- INNOVATIONS: ПЕРЕКЛЮЧАТЕЛЬ ---
    const techItems = document.querySelectorAll('.tech-menu__item');
    techItems.forEach(item => {
        item.addEventListener('click', () => {
            document.querySelector('.tech-menu__item.active')?.classList.remove('active');
            item.classList.add('active');
            
            const tech = item.dataset.tech;
            document.querySelectorAll('.tech-group').forEach(g => g.classList.remove('visible'));
            document.getElementById(`group-${tech}`)?.classList.add('visible');
            
            const status = document.getElementById('status-text');
            if (status) status.textContent = `${tech.toUpperCase()}_ACTIVE`;
        });
    });

    // --- BLOG: TILT EFFECT (3D НАКЛОН) ---
    const cards = document.querySelectorAll('.tilt-js');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rx = (rect.height / 2 - y) / 10;
            const ry = (x - rect.width / 2) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });

    // --- CONTACT FORM: КАПЧА И ВАЛИДАЦИЯ ---
    let captchaVal;
    const captchaLabel = document.getElementById('captcha-question');
    
    const initCaptcha = () => {
        if (!captchaLabel) return;
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        captchaVal = a + b;
        captchaLabel.textContent = `${a} + ${b} = ?`;
    };

    const form = document.getElementById('yield-form');
    if (form) {
        initCaptcha();
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const ans = parseInt(document.getElementById('captcha-answer').value);
            
            if (ans !== captchaVal) {
                alert('Ошибка: Неверный ответ капчи!');
                initCaptcha();
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            // Имитация AJAX
            setTimeout(() => {
                document.getElementById('form-success').style.display = 'flex';
                form.reset();
                initCaptcha();
                btn.textContent = 'Запросить доступ';
                btn.disabled = false;
            }, 1500);
        });
    }

    // --- COOKIE POPUP (ИСПРАВЛЕНО) ---
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieBtn = document.getElementById('cookie-accept');

    if (cookiePopup && !localStorage.getItem('yield_xie_cookies_2026')) {
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 2500);
    }

    if (cookieBtn) {
        cookieBtn.addEventListener('click', () => {
            localStorage.setItem('yield_xie_cookies_2026', 'true');
            cookiePopup.classList.remove('show');
        });
    }
});

// Глобальная функция для кнопки "Ок" в сообщении об успехе
window.resetForm = () => {
    const successMsg = document.getElementById('form-success');
    if (successMsg) successMsg.style.display = 'none';
};
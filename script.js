// ============================================================================
// ОСНОВНОЙ КОД САЙТА MASTERCOOL КУРСК
// ============================================================================

// DOM элементы
const DOM = {
    preloader: document.getElementById('preloader'),
    typedText: document.getElementById('typedText'),
    cursor: document.getElementById('cursor'),
    loadingBarFill: document.getElementById('loadingBarFill'),
    themeSwitcher: document.getElementById('themeSwitcher'),
    themeIcon: document.getElementById('themeIcon'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('navMenu'),
    waveLogo: document.getElementById('waveLogo'),
    currentYear: document.getElementById('currentYear')
};

// Конфигурация прелоадера
const PRELOADER_CONFIG = {
    textToType: 'MasterCool Курск',
    typingSpeed: 80, // мс на символ
    typingPause: 1500, // пауза после набора текста (мс)
    minDisplayTime: 3000, // минимальное время показа прелоадера (мс)
    loadingDuration: 2500, // длительность заполнения полосы загрузки (мс)
    cursorBlinkSpeed: 530 // скорость мигания курсора (мс)
};

// Конфигурация логотипа
const LOGO_CONFIG = {
    waveSpeed: 3, // скорость волны (сек)
    waveIntensity: 5, // интенсивность волны (px)
    waveDelay: 0.1, // задержка между буквами (сек)
    colors: ['#2563eb', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b']
};

// Состояние приложения
const STATE = {
    isLoading: true,
    isDarkTheme: localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
    isMenuOpen: false,
    typedTextIndex: 0,
    cursorVisible: true,
    loadStartTime: null,
    animations: []
};

// ============================================================================
// ФУНКЦИИ ПРЕЛОАДЕРА (ПОИСКОВАЯ СТРОКА)
// ============================================================================

/**
 * Инициализация прелоадера с анимацией поисковой строки
 */
function initPreloader() {
    STATE.loadStartTime = Date.now();
    
    // Инициализируем анимацию курсора
    initCursorAnimation();
    
    // Начинаем набор текста
    typeTextAnimation();
    
    // Запускаем заполнение полосы загрузки
    startLoadingBar();
    
    // Запускаем анимацию частиц
    initParticleAnimations();
    
    // Обработка полной загрузки страницы
    window.addEventListener('load', handlePageLoad);
    
    // Минимальное время показа прелоадера
    setTimeout(() => {
        if (STATE.isLoading) {
            STATE.isLoading = false;
        }
    }, PRELOADER_CONFIG.minDisplayTime);
}

/**
 * Анимация набора текста в поисковой строке
 */
function typeTextAnimation() {
    if (STATE.typedTextIndex < PRELOADER_CONFIG.textToType.length) {
        const char = PRELOADER_CONFIG.textToType.charAt(STATE.typedTextIndex);
        DOM.typedText.textContent += char;
        STATE.typedTextIndex++;
        
        // Случайная задержка для естественного набора
        const delay = Math.random() * 50 + PRELOADER_CONFIG.typingSpeed;
        setTimeout(typeTextAnimation, delay);
    } else {
        // После набора всего текста делаем паузу
        setTimeout(() => {
            DOM.cursor.style.opacity = '0';
        }, PRELOADER_CONFIG.typingPause);
    }
}

/**
 * Анимация мигающего курсора
 */
function initCursorAnimation() {
    function blinkCursor() {
        STATE.cursorVisible = !STATE.cursorVisible;
        DOM.cursor.style.opacity = STATE.cursorVisible ? '1' : '0';
        setTimeout(blinkCursor, PRELOADER_CONFIG.cursorBlinkSpeed);
    }
    blinkCursor();
}

/**
 * Анимация заполнения полосы загрузки
 */
function startLoadingBar() {
    let width = 0;
    const interval = 20;
    const increment = (interval / PRELOADER_CONFIG.loadingDuration) * 100;
    
    const loadingInterval = setInterval(() => {
        width += increment;
        if (width > 100) {
            width = 100;
            clearInterval(loadingInterval);
        }
        DOM.loadingBarFill.style.width = `${width}%`;
    }, interval);
}

/**
 * Инициализация анимации частиц
 */
function initParticleAnimations() {
    const particles = document.querySelectorAll('.search-particle');
    particles.forEach(particle => {
        const duration = 15 + Math.random() * 10;
        particle.style.animationDuration = `${duration}s`;
    });
}

/**
 * Обработка полной загрузки страницы
 */
function handlePageLoad() {
    // Проверяем, прошло ли минимальное время
    const elapsedTime = Date.now() - STATE.loadStartTime;
    const remainingTime = Math.max(0, PRELOADER_CONFIG.minDisplayTime - elapsedTime);
    
    setTimeout(() => {
        if (STATE.isLoading) {
            hidePreloader();
        }
    }, remainingTime);
}

/**
 * Плавное скрытие прелоадера
 */
function hidePreloader() {
    STATE.isLoading = false;
    
    // Добавляем класс для запуска CSS-анимации скрытия
    DOM.preloader.classList.add('loaded');
    
    // Удаляем прелоадер из DOM после анимации
    setTimeout(() => {
        if (DOM.preloader.parentNode) {
            DOM.preloader.parentNode.removeChild(DOM.preloader);
        }
        
        // Запускаем анимации на странице после загрузки
        initPageAnimations();
    }, 500);
}

// ============================================================================
// УПРАВЛЕНИЕ ТЕМОЙ
// ============================================================================

/**
 * Инициализация переключения темы
 */
function initTheme() {
    // Устанавливаем начальную тему
    updateTheme();
    
    // Обработчик клика на переключатель темы
    DOM.themeSwitcher.addEventListener('click', toggleTheme);
    
    // Следим за системными настройками
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            STATE.isDarkTheme = e.matches;
            updateTheme();
        }
    });
}

/**
 * Переключение темы
 */
function toggleTheme() {
    STATE.isDarkTheme = !STATE.isDarkTheme;
    localStorage.setItem('theme', STATE.isDarkTheme ? 'dark' : 'light');
    updateTheme();
    
    // Анимация переключателя
    animateThemeSwitch();
}

/**
 * Обновление темы на странице
 */
function updateTheme() {
    if (STATE.isDarkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        DOM.themeIcon.classList.remove('fa-moon');
        DOM.themeIcon.classList.add('fa-sun');
        DOM.themeSwitcher.title = 'Переключить на светлую тему';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        DOM.themeIcon.classList.remove('fa-sun');
        DOM.themeIcon.classList.add('fa-moon');
        DOM.themeSwitcher.title = 'Переключить на темную тему';
    }
}

/**
 * Анимация переключателя темы
 */
function animateThemeSwitch() {
    DOM.themeSwitcher.style.transform = 'scale(0.9)';
    setTimeout(() => {
        DOM.themeSwitcher.style.transform = 'scale(1)';
    }, 150);
}

// ============================================================================
// МОБИЛЬНОЕ МЕНЮ
// ============================================================================

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    DOM.hamburger.addEventListener('click', toggleMobileMenu);
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (STATE.isMenuOpen) {
                closeMobileMenu();
            }
        });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', (e) => {
        if (STATE.isMenuOpen && 
            !DOM.navMenu.contains(e.target) && 
            !DOM.hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

/**
 * Переключение мобильного меню
 */
function toggleMobileMenu() {
    STATE.isMenuOpen = !STATE.isMenuOpen;
    
    if (STATE.isMenuOpen) {
        openMobileMenu();
    } else {
        closeMobileMenu();
    }
}

/**
 * Открытие мобильного меню
 */
function openMobileMenu() {
    DOM.navMenu.classList.add('active');
    DOM.hamburger.classList.add('active');
    DOM.hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

/**
 * Закрытие мобильного меню
 */
function closeMobileMenu() {
    DOM.navMenu.classList.remove('active');
    DOM.hamburger.classList.remove('active');
    DOM.hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// ============================================================================
// АНИМАЦИЯ ЛОГОТИПА
// ============================================================================

/**
 * Инициализация волновой анимации логотипа
 */
function initLogoAnimation() {
    if (!DOM.waveLogo) return;
    
    const letters = DOM.waveLogo.querySelectorAll('.logo-letter');
    
    letters.forEach((letter, index) => {
        // Устанавливаем кастомное свойство для задержки
        letter.style.setProperty('--delay', `${index * LOGO_CONFIG.waveDelay}s`);
        
        // Добавляем случайный цвет для разнообразия
        if (index < LOGO_CONFIG.colors.length) {
            letter.style.color = LOGO_CONFIG.colors[index];
        }
        
        // Добавляем эффект при наведении
        letter.addEventListener('mouseenter', () => {
            animateLetter(letter);
        });
    });
    
    // Запускаем волновую анимацию
    startWaveAnimation(letters);
}

/**
 * Анимация отдельной буквы
 */
function animateLetter(letter) {
    letter.style.transform = 'translateY(-8px) scale(1.2)';
    letter.style.color = LOGO_CONFIG.colors[Math.floor(Math.random() * LOGO_CONFIG.colors.length)];
    
    setTimeout(() => {
        letter.style.transform = '';
        // Возвращаем оригинальный цвет
        const originalColor = letter.getAttribute('data-color');
        if (originalColor) {
            letter.style.color = originalColor;
        }
    }, 300);
}

/**
 * Запуск волновой анимации
 */
function startWaveAnimation(letters) {
    let waveActive = false;
    
    function createWave() {
        if (waveActive) return;
        waveActive = true;
        
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.transform = `translateY(-${LOGO_CONFIG.waveIntensity}px)`;
                
                setTimeout(() => {
                    letter.style.transform = 'translateY(0)';
                    
                    if (index === letters.length - 1) {
                        waveActive = false;
                    }
                }, 300);
            }, index * 80);
        });
    }
    
    // Запускаем волну каждые X секунд
    setInterval(createWave, LOGO_CONFIG.waveSpeed * 1000);
    
    // Также запускаем при наведении на логотип
    DOM.waveLogo.addEventListener('mouseenter', createWave);
}

// ============================================================================
// ПЛАВНАЯ ПРОКРУТКА
// ============================================================================

/**
 * Инициализация плавной прокрутки
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================================================
// АНИМАЦИИ ПРИ СКРОЛЛЕ
// ============================================================================

/**
 * Инициализация анимаций при скролле
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .service-card, .contact-card, .channel-card, .article-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Для карточек добавляем задержку
                if (entry.target.classList.contains('service-card') || 
                    entry.target.classList.contains('contact-card') ||
                    entry.target.classList.contains('channel-card') ||
                    entry.target.classList.contains('article-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Инициализация анимаций страницы
 */
function initPageAnimations() {
    // Анимация появления элементов при загрузке
    document.querySelectorAll('.animate-fade-in, .animate-fade-in-delay, .animate-fade-in-delay-2, .animate-slide-in').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translate(0, 0)';
    });
    
    // Запускаем анимации при скролле
    initScrollAnimations();
}

// ============================================================================
// ФИКСИРОВАННЫЙ ХЕДЕР
// ============================================================================

/**
 * Инициализация фиксированного хедера
 */
function initFixedHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ============================================================================
// ОБНОВЛЕНИЕ ГОДА В ФУТЕРЕ
// ============================================================================

/**
 * Обновление года в футере
 */
function updateCurrentYear() {
    if (DOM.currentYear) {
        DOM.currentYear.textContent = new Date().getFullYear();
    }
}

// ============================================================================
// TOOLTIPS ДЛЯ КАРТОЧЕК
// ============================================================================

/**
 * Инициализация тултипов
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        
        // Создаем элемент тултипа
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = tooltipText;
        document.body.appendChild(tooltip);
        
        // Показываем тултип при наведении
        element.addEventListener('mouseenter', (e) => {
            const rect = element.getBoundingClientRect();
            
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 10}px`;
            tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        // Скрываем тултип
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
    
    // Добавляем стили для тултипов
    const style = document.createElement('style');
    style.textContent = `
        .custom-tooltip {
            position: fixed;
            background: var(--bg-primary);
            color: var(--text-primary);
            padding: 0.5rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
            z-index: 10000;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            max-width: 200px;
            text-align: center;
        }
        
        .custom-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: var(--bg-primary) transparent transparent transparent;
        }
    `;
    document.head.appendChild(style);
}

// ============================================================================
// ОБРАБОТКА КНОПКИ "ПОЗВОНИТЬ"
// ============================================================================

/**
 * Инициализация кнопки "Позвонить"
 */
function initCallButton() {
    const callButtons = document.querySelectorAll('a[href^="tel:"]');
    
    callButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Анимация нажатия
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Логируем событие
            console.log('Нажата кнопка звонка:', button.href);
            
            // Открываем ссылку (телефонный номер) в новой вкладке
            // Не прерываем стандартное поведение
        });
    });
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
// ============================================================================

/**
 * Инициализация всего приложения
 */
function initApp() {
    // Инициализация прелоадера
    initPreloader();
    
    // Инициализация темы
    initTheme();
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация анимации логотипа
    initLogoAnimation();
    
    // Инициализация плавной прокрутки
    initSmoothScroll();
    
    // Инициализация фиксированного хедера
    initFixedHeader();
    
    // Обновление года в футере
    updateCurrentYear();
    
    // Инициализация тултипов
    initTooltips();
    
    // Инициализация кнопки "Позвонить"
    initCallButton();
    
    // Добавляем стили для индикатора загрузки статей
    addArticleAnimations();
    
    // Инициализация обработчика клавиатуры
    initKeyboardShortcuts();
}

/**
 * Добавление анимаций для статей
 */
function addArticleAnimations() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach((card, index) => {
        // Устанавливаем задержку для последовательного появления
        card.style.animationDelay = `${index * 0.05}s`;
        
        // Добавляем эффект при наведении
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Инициализация горячих клавиш
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + T для переключения темы
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Escape для закрытия меню
        if (e.key === 'Escape' && STATE.isMenuOpen) {
            closeMobileMenu();
        }
        
        // Пробел для скролла вниз
        if (e.key === ' ' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            window.scrollBy({
                top: window.innerHeight * 0.8,
                behavior: 'smooth'
            });
        }
    });
}

// ============================================================================
// ОБРАБОТЧИКИ СОБЫТИЙ ПРИ ЗАГРУЗКЕ
// ============================================================================

// Запускаем инициализацию при полной загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    // Закрываем мобильное меню при увеличении ширины
    if (window.innerWidth > 768 && STATE.isMenuOpen) {
        closeMobileMenu();
    }
});

// ============================================================================
// ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ
// ============================================================================

/**
 * Вспомогательная функция для debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Вспомогательная функция для throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================================================
// СОЗДАНИЕ 3D ЭФФЕКТОВ ДЛЯ КАРТОЧЕК
// ============================================================================

/**
 * Создание 3D эффекта при наведении на карточки
 */
function init3DCardEffects() {
    const cards = document.querySelectorAll('.service-card, .contact-card, .channel-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Запускаем 3D эффекты после загрузки страницы
setTimeout(init3DCardEffects, 1000);

// ============================================================================
// ПРОГРЕСС БАР ПРИ ПРОКРУТКЕ
// ============================================================================

/**
 * Создание прогресс-бара прокрутки
 */
function initScrollProgressBar() {
    // Создаем элемент прогресс-бара
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--gradient-primary);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Обновляем прогресс при скролле
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Запускаем прогресс-бар
setTimeout(initScrollProgressBar, 2000);

// ============================================================================
// КОНЕЦ КОДА
// ============================================================================
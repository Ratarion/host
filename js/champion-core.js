// === ОБЩАЯ ЛОГИКА МЕНЮ ===
const navIcon = document.getElementById('nav-icon');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-list a');
const headerBtn = document.querySelector('.header-call-btn');

function toggleMenu() {
    if (!navList || !navIcon) return;
    const isOpen = navList.classList.toggle('show');
    navIcon.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (headerBtn) {
        headerBtn.style.opacity = isOpen ? '0' : '1';
        headerBtn.style.pointerEvents = isOpen ? 'none' : 'auto';
    }
}

if (navIcon) navIcon.addEventListener('click', toggleMenu);
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navList.classList.contains('show')) toggleMenu();
    });
});

function initUniversalFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    // Путь к файлу футера (../ так как страницы чемпионов лежат в подпапке)
    fetch('../components/footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Footer file not found');
            return response.text();
        })
        .then(data => {
            footerPlaceholder.innerHTML = data;
            const yearSpan = document.getElementById('current-year');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}

// === УНИВЕРСАЛЬНЫЙ СЛАЙДЕР ===
document.addEventListener('DOMContentLoaded', () => {
    initUniversalFooter();

    const wrapper = document.getElementById('gallery-slides');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    if (!wrapper || !dotsContainer) return;

    const photosAttr = wrapper.getAttribute('data-photos');
    if (!photosAttr) return;
    
    // Фильтруем пустые значения на случай лишних запятых
    const photos = photosAttr.split(',').map(s => s.trim()).filter(s => s !== "");
    let currentIndex = 0;

    photos.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('slide');
        img.alt = `Photo ${index + 1}`;
        wrapper.appendChild(img);

        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        const total = photos.length;
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        
        currentIndex = index;
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    let autoPlay = setInterval(() => goToSlide(currentIndex + 1), 5000);
    const sliderArea = document.querySelector('.gallery-slider');
    
    if (sliderArea) {
        sliderArea.addEventListener('mouseenter', () => clearInterval(autoPlay));
        sliderArea.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => goToSlide(currentIndex + 1), 5000);
        });
    }
});


// ===================== СЛАЙДЕР ЩЕНКОВ (PUPPIES) =====================
const puppySliders = document.querySelectorAll('.puppies-slider'); // Ищем ВСЕ слайдеры!

puppySliders.forEach((slider) => {
    const wrapper = slider.querySelector('.puppies-wrapper');
    const cards = slider.querySelectorAll('.puppy-card');
    let prevBtn = slider.querySelector('.puppy-prev');
    let nextBtn = slider.querySelector('.puppy-next');
    const dotsContainer = slider.querySelector('.puppy-dots');

    if (!wrapper || cards.length === 0) return;

    // УМНЫЙ ФИКС CSS ЧЕРЕЗ JS:
    // Оборачиваем ленту карточек в окно с overflow: hidden. 
    // Карточки перестанут вываливаться, а стрелки (они снаружи) не обрежутся!
    if (!wrapper.parentElement.classList.contains('puppies-window')) {
        const windowDiv = document.createElement('div');
        windowDiv.className = 'puppies-window';
        windowDiv.style.width = '100%';
        // Отступы нужны, чтобы красивые тени от карточек при наведении не обрезались
        windowDiv.style.padding = '15px 5px';
        windowDiv.style.margin = '-15px -5px';
        
        wrapper.parentNode.insertBefore(windowDiv, wrapper);
        windowDiv.appendChild(wrapper);
    }

    let currentIndex = 0;
    const total = cards.length;

    // Динамическое определение количества карточек на экране
    function getCardsPerView() {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    // Функция скрытия/показа элементов управления в зависимости от количества карт
    function updateControlsVisibility(totalElements, cardsVisible) {
        const shouldHide = totalElements <= cardsVisible; 
        
        if (shouldHide) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
        } else {
            // Пустая строка возвращает дефолтные стили из CSS (block, flex и т.д.)
            if (prevBtn) prevBtn.style.display = ''; 
            if (nextBtn) nextBtn.style.display = '';
            if (dotsContainer) dotsContainer.style.display = '';
        }
    }

    // Функция создания точек
    function createPuppyDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const maxIndex = Math.max(0, total - getCardsPerView());
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('puppy-dot'); 
            if (i === currentIndex) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                currentIndex = i;
                goToPuppiesSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Функция смещения слайдера
    function goToPuppiesSlide() {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.max(0, total - cardsPerView);
        
        // Зацикливание слайдера
        if (currentIndex < 0) {
            currentIndex = maxIndex;
        } else if (currentIndex > maxIndex) {
            currentIndex = 0;
        }

        const gap = 24; // Отступ между карточками из CSS
        const cardWidth = cards[0].getBoundingClientRect().width;
        const offset = currentIndex * (cardWidth + gap);

        wrapper.style.transform = `translateX(-${offset}px)`;

        // Обновление активной точки
        const dots = dotsContainer.querySelectorAll('.puppy-dot');
        if (dots.length > 0) {
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }
    }

    // Навешивание кликов на стрелочки
    if (prevBtn) {
        const newPrev = prevBtn.cloneNode(true); // Сбрасываем старые события
        prevBtn.replaceWith(newPrev);
        prevBtn = newPrev;
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            goToPuppiesSlide();
        });
    }

    if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.replaceWith(newNext);
        nextBtn = newNext;
        nextBtn.addEventListener('click', () => {
            currentIndex++;
            goToPuppiesSlide();
        });
    }

    // Автопрокрутка раз в 5 секунд
    let autoInterval = setInterval(() => {
        currentIndex++;
        goToPuppiesSlide();
    }, 5000);

    // Пауза автопрокрутки при наведении мыши
    slider.addEventListener('mouseenter', () => clearInterval(autoInterval));
    slider.addEventListener('mouseleave', () => {
        autoInterval = setInterval(() => {
            currentIndex++;
            goToPuppiesSlide();
        }, 5000);
    });

    // Отслеживание изменения размеров окна браузера
    window.addEventListener('resize', () => {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.max(0, total - cardsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        
        createPuppyDots();
        goToPuppiesSlide();
        
        // Проверяем видимость кнопок при ресайзе экрана
        updateControlsVisibility(total, cardsPerView);
    });

    // Инициализация при первой загрузке страницы
    createPuppyDots();
    goToPuppiesSlide();
    
    // Проверяем видимость кнопок при старте
    updateControlsVisibility(total, getCardsPerView());
});
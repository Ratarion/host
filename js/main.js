const navIcon = document.getElementById('nav-icon');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-list a');
const headerBtn = document.querySelector('.header-call-btn'); // Новый класс

function toggleMenu() {
    const isOpen = navList.classList.toggle('show');
    navIcon.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Прячем кнопку в шапке, чтобы не мешалась
    if (headerBtn) {
        headerBtn.style.opacity = isOpen ? '0' : '1';
        headerBtn.style.pointerEvents = isOpen ? 'none' : 'auto';
    }
}

navIcon.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navList.classList.contains('show')) toggleMenu();
    });
});

function initUniversalFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    // Путь к файлу футера
    fetch('components/footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Footer file not found');
            return response.text();
        })
        .then(data => {
            footerPlaceholder.innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}

// ===================== СЛАЙДЕР ГАЛЕРЕИ (ДИНАМИЧЕСКИЙ) =====================
document.addEventListener('DOMContentLoaded', () => {
    initUniversalFooter();

    const gallerySlider = document.querySelector('.gallery-slider');
    if (!gallerySlider) return;

    const wrapper = document.getElementById('gallery-slides');

    // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
    const galleryImages = [
        "asset/img/tour/tour.jpg",
        "asset/img/tour/tour1.jpg",
        "asset/img/tour/tour2.jpg",
        "asset/gallery/Artemis hunting is my passion5.jpg",
    ];
    // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

    // Автоматически создаём все слайды
    wrapper.innerHTML = ''; // очищаем на всякий случай
    galleryImages.forEach(src => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${src}" alt="Ирландский сеттер">`;
        wrapper.appendChild(slide);
    });

    const slides = wrapper.querySelectorAll('.slide');
    const prevBtn = gallerySlider.querySelector('.slider-prev');
    const nextBtn = gallerySlider.querySelector('.slider-next');
    const dotsContainer = gallerySlider.querySelector('.slider-dots');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Создаём точки
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Автопрокрутка
    let autoplayInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 4000);

    gallerySlider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    gallerySlider.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 4000);
    });

    // Свайп на мобильных
    let startX = 0;
    wrapper.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    wrapper.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        if (endX < startX - 50) goToSlide(currentIndex + 1);
        else if (endX > startX + 50) goToSlide(currentIndex - 1);
    });

    // Инициализация
    goToSlide(0);
});


// Слайдер litters
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.litters-slider');
    if (!slider) return;

    const wrapper = slider.querySelector('.litters-wrapper');
    const cards = slider.querySelectorAll('.producer-card');
    const prevBtn = slider.querySelector('.litter-prev');
    const nextBtn = slider.querySelector('.litter-next');
    const dotsContainer = slider.querySelector('.litter-dots');

    let currentIndex = 0;
    const total = cards.length;
    const GAP = 40;

    if (total === 0) return;

    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.classList.add('litter-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.litter-dot');

    function goToSlide(index) {
        currentIndex = (index + total) % total;

        const cardWidth = cards[0].getBoundingClientRect().width;
        const offset = currentIndex * (cardWidth + GAP);

        wrapper.style.transform = `translateX(-${offset}px)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    let autoInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);

    slider.addEventListener('mouseenter', () => clearInterval(autoInterval));
    slider.addEventListener('mouseleave', () => {
        autoInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    });

    window.addEventListener('resize', () => goToSlide(currentIndex));

    goToSlide(0);
});

// Слайдер champion
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.champions-slider');
    if (!slider) return;

    const wrapper = slider.querySelector('.champions-wrapper');
    const cards = slider.querySelectorAll('.champion-card');
    const prevBtn = slider.querySelector('.champion-prev');
    const nextBtn = slider.querySelector('.champion-next');
    const dotsContainer = slider.querySelector('.champion-dots');

    let currentIndex = 0;
    const total = cards.length;
    if (total === 0) return;

    // Создаём точки
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.classList.add('champion-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.champion-dot');

    function goToSlide(index) {
        currentIndex = (index + total) % total;

        const gap = 40;

        // ширина одной карточки
        const cardWidth = cards[0].getBoundingClientRect().width;

        // смещение = ширина карточки + gap
        const offset = currentIndex * (cardWidth + gap);

        wrapper.style.transform = `translateX(-${offset}px)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Автопрокрутка
    let autoInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);

    slider.addEventListener('mouseenter', () => clearInterval(autoInterval));
    slider.addEventListener('mouseleave', () => {
        autoInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    });

    goToSlide(0);
});



// Падающие звёздочки в Hero
function createFallingStars() {
    const container = document.querySelector('.stars-container');
    if (!container) return;

    const starCount = 45;   // количество звёзд

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.textContent = '✦';           // красивая звёздочка

        // Случайное положение и задержка
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = 12 + Math.random() * 18;   // от 12 до 30 секунд

        star.style.left = `${left}vw`;
        star.style.animationDelay = `-${delay}s`;
        star.style.animationDuration = `${duration}s`;

        container.appendChild(star);
    }
}

// Запускаем после загрузки
document.addEventListener('DOMContentLoaded', createFallingStars);
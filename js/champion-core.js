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
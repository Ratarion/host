document.addEventListener('DOMContentLoaded', () => {

    // ===================== НАВИГАЦИЯ =====================
    const navIcon = document.getElementById('nav-icon');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');
    const headerBtn = document.querySelector('.header-call-btn');

    function toggleMenu() {
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


    // ===================== ФУТЕР =====================
    function initUniversalFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;

        fetch('/components/footer.html')
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

    initUniversalFooter();


    // ===================== СЛАЙДЕР ГАЛЕРЕИ =====================
    const gallerySlider = document.querySelector('.gallery-slider');
    if (gallerySlider) {
        const wrapper = document.getElementById('gallery-slides');
        const galleryImages = [
            "asset/img/tour/tour.jpg",
            "asset/img/tour/tour1.jpg",
            "asset/img/tour/tour2.jpg",
            "asset/gallery/Artemis hunting is my passion5.jpg",
        ];

        wrapper.innerHTML = '';
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

        // Точки
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

        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        // Автопрокрутка
        let autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 4000);

        gallerySlider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        gallerySlider.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 4000);
        });

        // Свайпы
        let startX = 0;
        wrapper.addEventListener('touchstart', e => startX = e.touches[0].clientX);
        wrapper.addEventListener('touchend', e => {
            const endX = e.changedTouches[0].clientX;
            if (endX < startX - 50) goToSlide(currentIndex + 1);
            else if (endX > startX + 50) goToSlide(currentIndex - 1);
        });

        goToSlide(0);
    }


    // ===================== СЛАЙДЕР LITTERS =====================
    const littersSlider = document.querySelector('.litters-slider');
    if (littersSlider) {
        const wrapper = littersSlider.querySelector('.litters-wrapper');
        const cards = littersSlider.querySelectorAll('.producer-card');
        const prevBtn = littersSlider.querySelector('.litter-prev');
        const nextBtn = littersSlider.querySelector('.litter-next');
        const dotsContainer = littersSlider.querySelector('.litter-dots');

        let currentIndex = 0;
        const total = cards.length;
        const GAP = 40;

        if (total > 0) {
            // Точки
            dotsContainer.innerHTML = '';
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('div');
                dot.classList.add('litter-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToLitterSlide(i));
                dotsContainer.appendChild(dot);
            }
            const dots = dotsContainer.querySelectorAll('.litter-dot');

            function goToLitterSlide(index) {
                currentIndex = (index + total) % total;
                const cardWidth = cards[0].getBoundingClientRect().width;
                const offset = currentIndex * (cardWidth + GAP);

                wrapper.style.transform = `translateX(-${offset}px)`;

                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            }

            if (prevBtn) prevBtn.addEventListener('click', () => goToLitterSlide(currentIndex - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => goToLitterSlide(currentIndex + 1));

            let autoInterval = setInterval(() => goToLitterSlide(currentIndex + 1), 5000);

            littersSlider.addEventListener('mouseenter', () => clearInterval(autoInterval));
            littersSlider.addEventListener('mouseleave', () => {
                autoInterval = setInterval(() => goToLitterSlide(currentIndex + 1), 5000);
            });

            window.addEventListener('resize', () => goToLitterSlide(currentIndex));
            goToLitterSlide(0);
        }
    }


    // ===================== СЛАЙДЕР CHAMPIONS =====================
    const championsSlider = document.querySelector('.champions-slider');
    if (championsSlider) {
        const wrapper = championsSlider.querySelector('.champions-wrapper');
        const cards = championsSlider.querySelectorAll('.champion-card');
        const prevBtn = championsSlider.querySelector('.champion-prev');
        const nextBtn = championsSlider.querySelector('.champion-next');
        const dotsContainer = championsSlider.querySelector('.champion-dots');

        let currentIndex = 0;
        const total = cards.length;

        if (total > 0) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('div');
                dot.classList.add('champion-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToChampionSlide(i));
                dotsContainer.appendChild(dot);
            }
            const dots = dotsContainer.querySelectorAll('.champion-dot');

            function goToChampionSlide(index) {
                currentIndex = (index + total) % total;
                const gap = 40;
                const cardWidth = cards[0].getBoundingClientRect().width;
                const offset = currentIndex * (cardWidth + gap);

                wrapper.style.transform = `translateX(-${offset}px)`;

                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            }

            if (prevBtn) prevBtn.addEventListener('click', () => goToChampionSlide(currentIndex - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => goToChampionSlide(currentIndex + 1));

            let autoInterval = setInterval(() => goToChampionSlide(currentIndex + 1), 5000);

            championsSlider.addEventListener('mouseenter', () => clearInterval(autoInterval));
            championsSlider.addEventListener('mouseleave', () => {
                autoInterval = setInterval(() => goToChampionSlide(currentIndex + 1), 5000);
            });

            goToChampionSlide(0);
        }
    }

    // ===================== СЛАЙДЕР ЩЕНКОВ (PUPPIES) =====================
    const puppiesSlider = document.querySelector('.puppies-slider');
    if (puppiesSlider) {
        const wrapper = puppiesSlider.querySelector('.puppies-wrapper');
        const cards = puppiesSlider.querySelectorAll('.puppy-card');
        const prevBtn = puppiesSlider.querySelector('.puppy-prev');
        const nextBtn = puppiesSlider.querySelector('.puppy-next');
        const dotsContainer = puppiesSlider.querySelector('.puppy-dots');

        let currentIndex = 0;
        const total = cards.length;

        if (total > 0) {
            // Динамическое определение количества карточек на экране
            function getCardsPerView() {
                if (window.innerWidth <= 576) return 1;
                if (window.innerWidth <= 992) return 2;
                return 3;
            }

            // Функция создания точек
            function createPuppyDots() {
                if (!dotsContainer) return;
                dotsContainer.innerHTML = '';
                const maxIndex = Math.max(0, total - getCardsPerView());
                
                for (let i = 0; i <= maxIndex; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('puppy-dot'); // Исправлено на puppy-dot из CSS
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
                
                // ЦИКЛИЧНОСТЬ: если ушли в минус — прыгаем в конец. Если больше максимума — в начало.
                if (currentIndex < 0) {
                    currentIndex = maxIndex;
                } else if (currentIndex > maxIndex) {
                    currentIndex = 0;
                }

                const gap = 24; // Отступ gap из puppies.css
                const cardWidth = cards[0].getBoundingClientRect().width;
                const offset = currentIndex * (cardWidth + gap);

                wrapper.style.transform = `translateX(-${offset}px)`;

                // Подсветка активной точки
                const dots = dotsContainer.querySelectorAll('.puppy-dot');
                if (dots.length > 0) {
                    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
                }
            }

            // Навешивание кликов на стрелочки
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentIndex--;
                    goToPuppiesSlide();
                });
            }

            if (nextBtn) {
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
            puppiesSlider.addEventListener('mouseenter', () => clearInterval(autoInterval));
            puppiesSlider.addEventListener('mouseleave', () => {
                autoInterval = setInterval(() => {
                    currentIndex++;
                    goToPuppiesSlide();
                }, 5000);
            });

            // Отслеживание изменения размеров окна браузера
            window.addEventListener('resize', () => {
                // Корректируем индекс, если при повороте экрана он оказался за пределами
                const maxIndex = Math.max(0, total - getCardsPerView());
                if (currentIndex > maxIndex) currentIndex = maxIndex;
                
                createPuppyDots();
                goToPuppiesSlide();
            });

            // Инициализация слайдера
            createPuppyDots();
            goToPuppiesSlide();
        }
    }


    // ===================== СЛАЙДЕР ОТЗЫВОВ =====================
    const feedbackSection = document.querySelector('.feedback-section');
    
    if (feedbackSection) {
    
        const track = document.getElementById('feedbackTrack');
    
        const slides = [
            ...document.querySelectorAll('.feedback-slide')
        ];
    
        const prevBtn = feedbackSection.querySelector('.feedback-arrow.prev');
    
        const nextBtn = feedbackSection.querySelector('.feedback-arrow.next');
    
        const dotsContainer = document.getElementById('feedbackDots');
    
        let currentIndex = 0;
    
        // ===== Центрирование =====
        function updateSlider() {
        
            if (!slides.length) return;
        
            const container = track.parentElement;
        
            const containerWidth = container.clientWidth;
        
            const slideWidth = slides[0].offsetWidth;
        
            const gap =
                parseFloat(getComputedStyle(track).gap) || 0;
        
            const step = slideWidth + gap;
        
            // Центр активной карточки
            const translate =
                (containerWidth / 2) -
                (slideWidth / 2) -
                (currentIndex * step);
        
            track.style.transform =
                `translateX(${translate}px)`;
        
            // Active class
            slides.forEach((slide, index) => {
            
                slide.classList.toggle(
                    'active',
                    index === currentIndex
                );
            });
        
            // Active dots
            const dots =
                dotsContainer.querySelectorAll('.feedback-dot');
        
            dots.forEach((dot, index) => {
            
                dot.classList.toggle(
                    'active',
                    index === currentIndex
                );
            });
        }
    
        // ===== Точки =====
        function createDots() {
        
            dotsContainer.innerHTML = '';
        
            slides.forEach((_, index) => {
            
                const dot = document.createElement('div');
            
                dot.className = 'feedback-dot';
            
                if (index === 0) {
                    dot.classList.add('active');
                }
            
                dot.addEventListener('click', () => {
                
                    currentIndex = index;
                
                    updateSlider();
                });
            
                dotsContainer.appendChild(dot);
            });
        }
    
        // ===== Переключение =====
        function moveSlider(direction) {
        
            currentIndex += direction;
        
            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            }
        
            if (currentIndex >= slides.length) {
                currentIndex = 0;
            }
        
            updateSlider();
        }
    
        // ===== Кнопки =====
        if (prevBtn) {
        
            prevBtn.addEventListener('click', () => {
            
                moveSlider(-1);
            });
        }
    
        if (nextBtn) {
        
            nextBtn.addEventListener('click', () => {
            
                moveSlider(1);
            });
        }
    
        // ===== Resize =====
        window.addEventListener(
            'resize',
            updateSlider
        );
    
        // ===== Init =====
        createDots();
    
        updateSlider();
    }

    // ===================== ПАДАЮЩИЕ ЗВЁЗДЫ =====================
    function createFallingStars() {
        const container = document.querySelector('.stars-container');
        if (!container) return;

        const starCount = 45;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.textContent = '✦';

            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 12 + Math.random() * 18;

            star.style.left = `${left}vw`;
            star.style.animationDelay = `-${delay}s`;
            star.style.animationDuration = `${duration}s`;

            container.appendChild(star);
        }
    }

    createFallingStars();

});
// Функция для проверки загрузки библиотек
// 🔧 ФИКС: Принудительно отключаем touch-режим в turn.js даже на мобильных
Object.defineProperty(window, 'Touch', {
    get: function() { return undefined; },
    configurable: true
});

function checkDependencies() {
    return new Promise((resolve, reject) => {
        if (typeof jQuery !== 'undefined' && typeof jQuery.fn.turn !== 'undefined') {
            resolve();
            return;
        }
        
        const checkInterval = setInterval(() => {
            if (typeof jQuery !== 'undefined' && typeof jQuery.fn.turn !== 'undefined') {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error('Библиотеки не загрузились'));
        }, 10000);
    });
}

// Основная функция инициализации
function initBook() {
    const closedBookWrap = document.getElementById('closed-book');
    const openBookWrap = document.getElementById('opened-book');
    
    if (!closedBookWrap || !openBookWrap) {
        console.error('Не найдены элементы книг');
        return;
    }
    
    const openButton = closedBookWrap.querySelector('.book__btn.next');
    const prevButton = openBookWrap.querySelector('.book__btn.prev');
    const nextButton = openBookWrap.querySelector('.book__btn.next');
    const flipbook = openBookWrap.querySelector('.flipbook');

    const totalPages = 35;
    let isBookOpen = false;
    let turnInstance = null;
    let lastPage = 2;

    // ПРОСТАЯ ФУНКЦИЯ ДЛЯ МОБИЛЬНЫХ - ОДНА СТРАНИЦА
    function calculateBookSize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // ДЛЯ МОБИЛЬНЫХ: ТОЛЬКО ОДНА СТРАНИЦА
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            // Используем 95% ширины экрана для одной страницы
            let width = Math.floor(screenWidth * 0.95);
            
            // Высота рассчитывается пропорционально (оригинальное соотношение 420:570 = 1:1.36)
            let height = Math.floor(width * 1.36);
            
            // Проверяем, помещается ли по высоте
            if (height > screenHeight * 0.85) {
                height = Math.floor(screenHeight * 0.85);
                width = Math.floor(height / 1.36);
            }
            
            console.log('Мобильный размер (одна страница):', width, 'x', height);
            return { 
                width: width, 
                height: height,
                singlePage: true // Флаг для одной страницы
            };
        } else {
            // ДЛЯ ДЕСКТОПА: РАЗВОРОТ
            console.log('Десктоп размер (разворот): 840 x 570');
            return { 
                width: 840, 
                height: 570,
                singlePage: false
            };
        }
    }

    function openBook() {
        console.log('Открываем книгу...');
        
        // Переключаем видимость
        closedBookWrap.classList.remove('active');
        closedBookWrap.classList.add('hidden');
        openBookWrap.classList.remove('hidden');
        openBookWrap.classList.add('active');
        
        // Даем время на отрисовку
        setTimeout(() => {
            const sizes = calculateBookSize();
            
            // Определяем режим отображения
            const isMobile = window.innerWidth <= 768;
            const displayMode = isMobile ? 'single' : 'double';
            
            console.log('Режим отображения:', displayMode, 'Размеры:', sizes.width, 'x', sizes.height);
            
            // Устанавливаем размеры flipbook
            flipbook.style.width = sizes.width + 'px';
            flipbook.style.height = sizes.height + 'px';
            flipbook.style.display = 'block';
            flipbook.style.position = 'relative';
            flipbook.style.margin = '0 auto';
            flipbook.style.transform = 'none';
            flipbook.style.maxWidth = '100%';
            
            // Очищаем старый инстанс
            if ($(flipbook).data('turn')) {
                try {
                    $(flipbook).turn('destroy');
                } catch (e) {
                    console.log('Ошибка при очистке:', e);
                }
            }
            
            // Инициализируем turn.js
            setTimeout(() => {
                try {
                    turnInstance = $(flipbook).turn({
                        width: sizes.width,
                        height: sizes.height,
                        autoCenter: false,
                        duration: 600,
                        acceleration: true,
                        gradients: true,
                        pages: totalPages,
                        display: displayMode, // 'single' для мобильных, 'double' для десктопа
                        direction: 'ltr',
                        when: {
                            turning: function(e, page, view) {
                                const isGoingBack = page < lastPage;
                                if (isGoingBack) {
                                    setTimeout(updatePageNumbers, 30);
                                } else {
                                    setTimeout(updatePageNumbers, 150);
                                }
                                lastPage = page;
                            },
                            turned: function(e, page) {
                                updatePageNumbers();
                            }
                        }
                    });
                    
                    // Центрируем книгу
                    centerBook();
                    
                    // Переходим на первую страницу
                    $(flipbook).turn('page', isMobile ? 1 : 2);
                    isBookOpen = true;
                    lastPage = isMobile ? 1 : 2;
                    updatePageNumbers();
                    
                    console.log('Книга успешно открыта в режиме:', displayMode);
                    
                } catch (error) {
                    console.error('Ошибка инициализации turn.js:', error);
                    turnInstance = null;
                    
                    // Простой fallback для мобильных
                    if (window.innerWidth <= 768) {
                        showSimpleMobileView();
                    }
                }
            }, 50);
        }, 100);
    }

    function closeBook() {
        console.log('Закрываем книгу...');
        
        openBookWrap.classList.remove('active');
        openBookWrap.classList.add('hidden');
        closedBookWrap.classList.remove('hidden');
        closedBookWrap.classList.add('active');
        
        isBookOpen = false;
        
        if (turnInstance) {
            try {
                $(flipbook).turn('page', 1);
            } catch (e) {
                console.log('Ошибка при закрытии книги:', e);
            }
        }
    }
    
    function centerBook() {
        if (!flipbook) return;
        
        const bookWrap = document.querySelector('.book-wrap.active');
        if (bookWrap) {
            bookWrap.style.display = 'flex';
            bookWrap.style.alignItems = 'center';
            bookWrap.style.justifyContent = 'center';
            bookWrap.style.width = '100%';
            bookWrap.style.padding = '10px';
        }
        
        flipbook.style.margin = '0 auto';
    }
    
    // Простой вариант для мобильных если turn.js не работает
    function showSimpleMobileView() {
        console.log('Показываем простую мобильную версию');
        
        const pagesContainer = document.createElement('div');
        pagesContainer.style.cssText = `
            width: 100%;
            height: 100%;
            overflow-y: auto;
            padding: 10px;
        `;
        
        pagesContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3>Поздравление Виктории!</h3>
                <p>Используйте кнопки для навигации</p>
            </div>
        `;
        
        flipbook.innerHTML = '';
        flipbook.appendChild(pagesContainer);
    }

    function updatePageNumbers() {
        if (!isBookOpen || !turnInstance) return;

        try {
            const currentPage = $(flipbook).turn('page');
            const isMobile = window.innerWidth <= 768;
            
            let displayPage;
            if (isMobile) {
                // Для мобильных: одна страница = одна страница
                displayPage = currentPage;
            } else {
                // Для десктопа: разворот из двух страниц
                displayPage = currentPage === 1 ? 0 : Math.floor((currentPage - 2) / 2) + 1;
            }

            const text = `${displayPage} / 17`;
            document.querySelectorAll('.page__number').forEach(el => {
                el.textContent = text;
            });
        } catch (e) {
            console.log('Ошибка при обновлении номеров страниц:', e);
        }
    }

    // Функция обновления размеров при изменении экрана
    function updateBookSize() {
        if (!isBookOpen || !turnInstance) return;
        
        try {
            const sizes = calculateBookSize();
            const isMobile = window.innerWidth <= 768;
            const displayMode = isMobile ? 'single' : 'double';
            
            console.log('Обновление размеров:', sizes.width, 'x', sizes.height, 'режим:', displayMode);
            
            // Обновляем CSS
            flipbook.style.width = sizes.width + 'px';
            flipbook.style.height = sizes.height + 'px';
            flipbook.style.maxWidth = '100%';
            
            // Обновляем turn.js
            $(flipbook).turn('size', sizes.width, sizes.height);
            $(flipbook).turn('display', displayMode);
            $(flipbook).turn('resize');
            
            // Центрируем
            centerBook();
            
        } catch (error) {
            console.error('Ошибка при обновлении размеров:', error);
        }
    }

    // === Обработчики событий ===
    if (openButton) {
        openButton.addEventListener('click', openBook);
    }

    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isBookOpen || !turnInstance) return;
            
            try {
                const currentPage = $(flipbook).turn('page');
                const isMobile = window.innerWidth <= 768;
                
                if ((isMobile && currentPage === 1) || (!isMobile && currentPage <= 2)) {
                    closeBook();
                } else {
                    $(flipbook).turn('previous');
                }
            } catch (error) {
                console.error('Ошибка при перелистывании назад:', error);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isBookOpen || !turnInstance) return;
            
            try {
                const currentPage = $(flipbook).turn('page');
                if (currentPage < totalPages) {
                    $(flipbook).turn('next');
                }
            } catch (error) {
                console.error('Ошибка при перелистывании вперед:', error);
            }
        });
    }
    
    // Адаптация при изменении размера
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (turnInstance && isBookOpen) {
                updateBookSize();
            }
        }, 300);
    });

    // Обработчик ориентации
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (turnInstance && isBookOpen) {
                setTimeout(updateBookSize, 300);
            }
        }, 100);
    });
    
    // Инициализация закрытой книги
    setTimeout(() => {
        const closedFlipbook = closedBookWrap.querySelector('.flipbook');
        if (closedFlipbook) {
            const sizes = calculateBookSize();
            // Для закрытой книги - половина ширины для десктопа, полная для мобильных
            const isMobile = window.innerWidth <= 768;
            closedFlipbook.style.width = (isMobile ? sizes.width : sizes.width / 2) + 'px';
            closedFlipbook.style.height = sizes.height + 'px';
        }
    }, 100);
}

// Запуск
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM загружен, проверяем зависимости...');
    
    const openBookWrap = document.getElementById('opened-book');
    const closedBookWrap = document.getElementById('closed-book');
    
    if (openBookWrap) {
        openBookWrap.classList.add('hidden');
        openBookWrap.classList.remove('active');
    }
    
    if (closedBookWrap) {
        closedBookWrap.classList.add('active');
        closedBookWrap.classList.remove('hidden');
    }
    
    checkDependencies()
        .then(() => {
            console.log('✅ Все зависимости загружены');
            initBook();
        })
        .catch((error) => {
            console.error('❌ Ошибка загрузки зависимостей:', error);
            try {
                initBook();
            } catch (e) {
                console.error('Не удалось инициализировать книгу:', e);
            }
        });
});
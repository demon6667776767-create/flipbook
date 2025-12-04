

// Скрываем открытую книгу сразу при загрузке скрипта
(function() {
    const openBookWrap = document.querySelector('.book-wrap:last-of-type');
    const closedBookWrap = document.querySelector('.book-wrap:first-of-type');
    
    if (openBookWrap) openBookWrap.style.display = 'none';
    if (closedBookWrap) closedBookWrap.style.display = 'flex';
})();


// Функция для проверки загрузки библиотек
function checkDependencies() {
    return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
            if (typeof jQuery !== 'undefined' && typeof jQuery.fn.turn !== 'undefined') {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);

        // Таймаут на случай если библиотеки не загрузятся
        setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error('Библиотеки не загрузились'));
        }, 10000);
    });
}

// Ждём, пока DOM и все скрипты загрузятся
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM загружен, проверяем зависимости...');
    
    // Скрываем открытую книгу при загрузке страницы
    const openBookWrap = document.querySelector('.book-wrap:last-of-type');
    if (openBookWrap) {
        openBookWrap.style.display = 'none';
    }
    
    // Показываем закрытую книгу
    const closedBookWrap = document.querySelector('.book-wrap:first-of-type');
    if (closedBookWrap) {
        closedBookWrap.style.display = 'flex';
    }
    
    checkDependencies()
        .then(() => {
            console.log('✅ Все зависимости загружены');
            initBook();
        })
        .catch((error) => {
            console.error('❌ Ошибка загрузки зависимостей:', error);
            console.log('jQuery:', typeof jQuery);
            console.log('turn.js:', typeof jQuery.fn.turn);
        });
});

function initBook() {
    const closedBookWrap = document.querySelector('.book-wrap:first-of-type');
    const openBookWrap = document.querySelector('.book-wrap:last-of-type');
    const openButton = closedBookWrap.querySelector('.book__btn.next');
    const prevButton = openBookWrap.querySelector('.book__btn.prev');
    const nextButton = openBookWrap.querySelector('.book__btn.next');
    const flipbook = openBookWrap.querySelector('.flipbook');

    // Убедимся, что открытая книга скрыта
    openBookWrap.style.display = 'none';
    closedBookWrap.style.display = 'flex';

    const totalPages = 25;
    let isBookOpen = false;
    let turnInstance = null;
    let lastPage = 2;

    function openBook() {
        closedBookWrap.style.display = 'none';
        openBookWrap.style.display = 'flex';

        setTimeout(() => {
            if (!turnInstance) {
                turnInstance = $(flipbook).turn({
                    width: 840,
                    height: 570,
                    autoCenter: true,
                    duration: 800, // Идеальная скорость анимации
                    acceleration: true,
                    gradients: true,
                    pages: totalPages,
                    display: 'double',
                    direction: 'ltr',
                    when: {
                        turning: function(e, page, view) {
                            // Для перелистывания назад обновляем сразу с минимальной задержкой
                            const isGoingBack = page < lastPage;
                            if (isGoingBack) {
                                // Для назад - обновляем сразу с tiny задержкой
                                setTimeout(updatePageNumbers, 50);
                            } else {
                                // Для вперед - обновляем на ~30% прогресса
                                setTimeout(updatePageNumbers, 250); 
                            }
                            lastPage = page;
                        },
                        turned: function(e, page) {
                            // Финальное обновление на всякий случай
                            updatePageNumbers();
                            
                            if (page >= totalPages - 1) {
                                $(flipbook).turn('update');
                            }
                        }
                    }
                });

                $(flipbook).on('turned', updatePageNumbers);
            }

            // Открываем на первой развёртке
            $(flipbook).turn('page', 2);
            isBookOpen = true;
            lastPage = 2;
            updatePageNumbers();
        }, 100);
    }

    function closeBook() {
        closedBookWrap.style.display = 'flex';
        openBookWrap.style.display = 'none';
        isBookOpen = false;
    }

    function updatePageNumbers() {
        if (!isBookOpen) return;

        const currentPage = $(flipbook).turn('page');
        const displayPage = currentPage === 1
            ? 0
            : Math.floor((currentPage - 2) / 2) + 1;

        const text = `${displayPage} / 12`;
        document.querySelectorAll('.page__number').forEach(el => {
            el.textContent = text;
        });
    }

    // === Кнопки ===
    openButton?.addEventListener('click', openBook);

    prevButton?.addEventListener('click', () => {
        if (!isBookOpen) return;
        const currentPage = $(flipbook).turn('page');
        const currentLogical = currentPage === 1 ? 0 : Math.floor((currentPage - 2) / 2) + 1;
        if (currentLogical === 1) {
            closeBook();
        } else {
            $(flipbook).turn('previous');
        }
    });

    nextButton?.addEventListener('click', () => {
        if (!isBookOpen) return;
        const currentPage = $(flipbook).turn('page');
        if (currentPage < totalPages) {
            $(flipbook).turn('next');
        }
    });
}
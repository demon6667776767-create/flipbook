// Функция для создания SVG-звезды
function createStar(x, y, color) {
  const svgNS = "http://www.w3.org/2000/svg";
  const star = document.createElementNS(svgNS, "svg");
  star.setAttribute("width", "16");
  star.setAttribute("height", "16");
  star.setAttribute("viewBox", "0 0 16 16");
  star.setAttribute("class", `star ${color}`);
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;

  // Создаем путь для 5-конечной звезды
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", "M8,0 L9.5,4.5 L14.5,5 C15,5 15.5,5.5 15.5,6 L11,7.5 L10.5,12.5 C10.5,13 10,13.5 9.5,13.5 L8,9 L6.5,13.5 C6,13.5 5.5,13 5.5,12.5 L5,7.5 L0.5,6 C0,6 0,5.5 0.5,5 L5.5,4.5 L7,0 Z");

  // Явно задаем цвет звезды
  if (color === 'gold') {
    path.setAttribute("fill", "#FFD700");
  } else if (color === 'silver') {
    path.setAttribute("fill", "#C0C0C0");
  }

  star.appendChild(path);
  return star;
}

// Функция для добавления звезд на страницу
function addStarsToPage(pageContent) {
  // Очищаем предыдущие звезды
  const existingStars = pageContent.querySelectorAll('.star');
  existingStars.forEach(star => star.remove());

  // Получаем размеры контента
  const rect = pageContent.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // Количество звезд по периметру
  const starsPerSide = 12; // Можно изменить для большего/меньшего количества

  // Добавляем звезды по верхнему краю
  for (let i = 0; i < starsPerSide; i++) {
    const x = (i + 1) * width / (starsPerSide + 1);
    const y = 10; // Отступ от верха
    const color = Math.random() > 0.5 ? 'gold' : 'silver';
    const star = createStar(x, y, color);
    pageContent.appendChild(star);
  }

  // Добавляем звезды по нижнему краю
  for (let i = 0; i < starsPerSide; i++) {
    const x = (i + 1) * width / (starsPerSide + 1);
    const y = height - 20; // Отступ от низа
    const color = Math.random() > 0.5 ? 'gold' : 'silver';
    const star = createStar(x, y, color);
    pageContent.appendChild(star);
  }

  // Добавляем звезды по левому краю (без углов)
  for (let i = 1; i < starsPerSide; i++) {
    const x = 10; // Отступ от левого края
    const y = (i + 1) * height / (starsPerSide + 1);
    const color = Math.random() > 0.5 ? 'gold' : 'silver';
    const star = createStar(x, y, color);
    pageContent.appendChild(star);
  }

  // Добавляем звезды по правому краю (без углов)
  for (let i = 1; i < starsPerSide; i++) {
    const x = width - 20; // Отступ от правого края
    const y = (i + 1) * height / (starsPerSide + 1);
    const color = Math.random() > 0.5 ? 'gold' : 'silver';
    const star = createStar(x, y, color);
    pageContent.appendChild(star);
  }
}

// Запускаем функцию после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
  // Находим все страницы с текстом или изображением (внутренние страницы)
  // Исключаем обложку (класс .cover)
  const contentPages = document.querySelectorAll('.content--text, .content--image');

  // Добавляем звезды на каждую страницу
  contentPages.forEach(page => {
    addStarsToPage(page);
  });

  // Если используется turn.js, то добавляем обработчик события для перелистывания страниц
  if (typeof $.fn.turn !== 'undefined') {
    $('.flipbook').on('turning', function(event, page, view) {
      // После перелистывания страницы, снова добавляем звезды
      setTimeout(() => {
        // Находим текущую видимую страницу
        const currentPage = document.querySelector(`.page-wrapper[page="${page}"] .content`);
        if (currentPage) {
          addStarsToPage(currentPage);
        }
      }, 100); // Небольшая задержка для корректного отображения
    });
  }
});
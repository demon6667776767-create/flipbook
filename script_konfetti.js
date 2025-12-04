

// Создаем конфетти внутри книги
        document.addEventListener('DOMContentLoaded', function() {
            const decorationElements = document.querySelector('.decoration-elements');
            
            // Создаем конфетти внутри книги
            for (let i = 0; i < 20; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                
                // Позиционируем конфетти внутри книги (от верхнего края)
                confetti.style.left = `${Math.random() * 85 + 7.5}%`;
                confetti.style.animationDelay = `${Math.random() * 6}s`;
                
                const size = Math.random() * 8 + 6;
                const shapes = ['circle', 'diamond', 'star', 'square', 'heart'];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                const colors = ['#FFD700', '#4ECDC4', '#FF6B6B', '#FF69B4']; // Только 4 цвета
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                if (shape === 'circle') {
                    confetti.innerHTML = `
                        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                            <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="${color}"/>
                        </svg>
                    `;
                } else if (shape === 'diamond') {
                    confetti.innerHTML = `
                        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                            <rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" 
                                  fill="${color}" transform="rotate(45 ${size/2} ${size/2})"/>
                        </svg>
                    `;
                } else if (shape === 'square') {
                    confetti.innerHTML = `
                        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                            <rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" fill="${color}"/>
                        </svg>
                    `;
                } else if (shape === 'heart') {
                    confetti.innerHTML = `
                        <svg width="${size}" height="${size * 0.9}" viewBox="0 0 ${size} ${size * 0.9}">
                            <path d="M${size/2},${size * 0.15} C${size * 0.7},-${size * 0.1} ${size},${size * 0.1} ${size},${size * 0.3} C${size},${size * 0.5} ${size * 0.7},${size * 0.7} ${size/2},${size * 0.9} C${size * 0.3},${size * 0.7} 0,${size * 0.5} 0,${size * 0.3} C0,${size * 0.1} ${size * 0.3},-${size * 0.1} ${size/2},${size * 0.15} Z" 
                                  fill="${color}"/>
                        </svg>
                    `;
                } else {
                    confetti.innerHTML = `
                        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                            <polygon points="${size/2},2 ${size-2},${size/2} ${size/2},${size-2} 2,${size/2}" 
                                     fill="${color}"/>
                        </svg>
                    `;
                }
                
                decorationElements.appendChild(confetti);
            }
        });
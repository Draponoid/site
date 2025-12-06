// filter.js

/**
 * Инициализирует обработчики событий для кнопок фильтрации.
 * Должна быть вызвана после того, как renderDishes() создаст карточки.
 */
function initializeFilters() {
    // Проходим по всем секциям блюд
    document.querySelectorAll('.food-section').forEach(section => {
        const buttons = section.querySelectorAll('.filter-btn');
        const cards   = section.querySelectorAll('.food-card'); 

        buttons.forEach(button => {
            // Удаляем старый обработчик, чтобы избежать дублирования
            button.removeEventListener('click', handleFilterClick);
            button.addEventListener('click', handleFilterClick);
        });
        
        function handleFilterClick() {
            const kind = this.dataset.kind;
            
            // Если фильтр уже активен, сбрасываем его
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                cards.forEach(card => card.style.display = ''); // Показать все
                return;
            }

            // Активация нового фильтра
            section.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Применение фильтра: скрываем или показываем карточки
            cards.forEach(card => {
                if (card.dataset.kind === kind) {
                    card.style.display = ''; // Показать
                } else {
                    card.style.display = 'none'; // Скрыть
                }
            });
        }
    });
}
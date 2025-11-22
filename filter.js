// filters.js
// Логика вынесена в функцию, которая будет вызвана из render-dishes.js

function initializeFilters() {
    // Перебираем каждую секцию с фильтрами
    document.querySelectorAll('.food-section').forEach(section => {
        // Находим кнопки и карточки внутри текущей секции.
        const buttons = section.querySelectorAll('.filter-btn');
        const cards   = section.querySelectorAll('.food-card'); 

        buttons.forEach(button => {
            // Удаляем старые слушатели (на всякий случай) и добавляем новый
            button.removeEventListener('click', handleFilterClick);
            button.addEventListener('click', handleFilterClick);
        });
        
        // Объявляем функцию-обработчик клика
        function handleFilterClick() {
            const kind = this.dataset.kind; // Получаем значение фильтра из атрибута data-kind

            // 1. Снятие фильтра (Toggle)
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                cards.forEach(card => card.style.display = ''); // показываем все блюда
                return;
            }

            // 2. Установка фильтра
            
            // Снимаем active со всех кнопок в этой секции
            section.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Фильтруем карточки: показываем только те, у которых data-kind совпадает
            cards.forEach(card => {
                // Если атрибут data-kind карточки соответствует выбранному фильтру
                if (card.dataset.kind === kind) {
                    card.style.display = ''; // Показать
                } else {
                    card.style.display = 'none'; // Скрыть
                }
            });
        }
    });
}
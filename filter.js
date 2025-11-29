function initializeFilters() {
    document.querySelectorAll('.food-section').forEach(section => {
        const buttons = section.querySelectorAll('.filter-btn');
        const cards   = section.querySelectorAll('.food-card'); 

        buttons.forEach(button => {
            button.removeEventListener('click', handleFilterClick);
            button.addEventListener('click', handleFilterClick);
        });
        
        // Объявляем функцию-обработчик клика
        function handleFilterClick() {
            const kind = this.dataset.kind;
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                cards.forEach(card => card.style.display = '');
                return;
            }

            //Установка фильтра
            section.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            cards.forEach(card => {
                if (card.dataset.kind === kind) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    });
}
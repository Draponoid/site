// Этот скрипт выполняется синхронно сразу после render-dishes.js, 
// гарантируя, что все карточки уже есть в DOM.

// Хранение выбранных блюд: { soup: dishObject, main: dishObject, drink: dishObject }
const selectedDishes = {};

// DOM-элементы для обновления
const orderDetailsDiv = document.getElementById('order-details');
const totalCostDiv = document.getElementById('total-cost');
const totalPriceValueP = document.getElementById('total-price-value');
const orderForm = document.querySelector('.order-form');
const foodCards = document.querySelectorAll('.food-card'); 
const resetButton = document.querySelector('.btn-reset');

// Категории для отображения в блоке заказа
const categoryTitles = {
    soup: 'Суп',
    main: 'Главное блюдо',
    drink: 'Напиток',
};

/**
 * Обновляет блок "Ваш заказ" и подсчитывает итоговую стоимость.
 */
function updateOrderDetails() {
    let totalCost = 0;
    let orderHtml = '';
    const isAnyDishSelected = Object.keys(selectedDishes).some(key => selectedDishes[key]);

    if (!isAnyDishSelected) {
        orderDetailsDiv.innerHTML = '<p>Ничего не выбрано</p>';
        totalCostDiv.style.display = 'none';
        totalPriceValueP.textContent = '';
        return;
    }

    totalCostDiv.style.display = 'block';

    // 1. Обновление списка выбранных блюд по категориям
    Object.keys(categoryTitles).forEach(category => {
        const dish = selectedDishes[category];
        const categoryTitle = categoryTitles[category];

        orderHtml += `<p style="margin: 6px 0;"><strong>${categoryTitle}</strong></p>`;

        if (dish) {
            orderHtml += `<p style="margin: 0 0 10px 0;">${dish.name} ${dish.price}₽</p>`;
            totalCost += dish.price;
        } else {
            const noDishMessage = (category === 'drink') ? 'Напиток не выбран' : 'Блюдо не выбрано';
            orderHtml += `<p style="margin: 0 0 10px 0; color: #999;">${noDishMessage}</p>`;
        }
    });

    orderDetailsDiv.innerHTML = orderHtml;

    // 2. Обновление итоговой стоимости
    totalPriceValueP.textContent = `${totalCost}₽`;
}

/**
 * Добавляет скрытые поля с ключевыми словами для отправки формы
 */
function updateHiddenFields() {
    // Удаляем предыдущие скрытые поля
    orderForm.querySelectorAll('input[name^="selected_"]').forEach(input => input.remove());

    // Добавляем новые скрытые поля
    Object.keys(selectedDishes).forEach(category => {
        const dish = selectedDishes[category];
        if (dish) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = `selected_${category}`;
            hiddenInput.value = dish.keyword; // Отправляем keyword
            orderForm.appendChild(hiddenInput);
        }
    });
}

// Инициализация
updateOrderDetails();
updateHiddenFields();

// Обработчик клика на кнопку "Выбрать"
foodCards.forEach(card => {
    // Ищем кнопку внутри каждой карточки
    const selectButton = card.querySelector('button'); 

    if (selectButton) {
        selectButton.addEventListener('click', () => {
            const dishKeyword = card.getAttribute('data-dish');
            const selectedDish = dishes.find(d => d.keyword === dishKeyword);

            if (!selectedDish) return;

            const category = selectedDish.category;

            // 1. Снятие выделения с предыдущего выбранного блюда в этой категории
            const prevSelectedDish = selectedDishes[category];
            if (prevSelectedDish) {
                const prevCard = document.querySelector(`.food-card[data-dish="${prevSelectedDish.keyword}"]`);
                if (prevCard) {
                    prevCard.classList.remove('selected');
                }
            }

            // 2. Обновление выбранного блюда и выделение новой карточки
            selectedDishes[category] = selectedDish;
            card.classList.add('selected');

            // 3. Обновление секции "Ваш заказ" и стоимости
            updateOrderDetails();

            // 4. Обновление скрытых полей для отправки
            updateHiddenFields();
        });
    }
});

// Обработчик для кнопки сброса формы (Reset)
if (resetButton) {
    resetButton.addEventListener('click', () => {
        // Очистка выбранных блюд
        Object.keys(selectedDishes).forEach(key => delete selectedDishes[key]);

        // Снятие выделения со всех карточек
        document.querySelectorAll('.food-card.selected').forEach(card => {
            card.classList.remove('selected');
        });

        // Обновление секции заказа
        updateOrderDetails();
        updateHiddenFields();
    });
}
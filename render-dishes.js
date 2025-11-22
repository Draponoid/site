// Этот скрипт выполняется синхронно, создавая карточки блюд.

// 1. Сортировка блюд по имени в алфавитном порядке
const sortedDishes = [...dishes].sort((a, b) => {
    return a.name.localeCompare(b.name);
});

// Оптимизированные селекторы для контейнеров
const categories = {
    // Ищем .foods-grid внутри секции с соответствующим ID
    soup: document.querySelector('#soups').closest('.food-section').querySelector('.foods-grid'),
    main: document.querySelector('#mains').closest('.food-section').querySelector('.foods-grid'),
    drink: document.querySelector('#drinks').closest('.food-section').querySelector('.foods-grid'),
};

/**
 * Создает HTML-элемент карточки блюда.
 */
function createDishCard(dish) {
    const card = document.createElement('div');
    card.classList.add('food-card');
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-dish', dish.keyword); // data-атрибут для логики заказа

    // Путь к изображению: images/[category]/[keyword].webp
    const imagePath = `images/${dish.image}.webp`;

    card.innerHTML = `
        <img src="${imagePath}" alt="${dish.name}">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button type="button">Выбрать</button>
    `;

    return card;
}

// 2. Перебор массива и добавление карточек
sortedDishes.forEach(dish => {
    const targetGrid = categories[dish.category];
    if (targetGrid) {
        const card = createDishCard(dish);
        targetGrid.appendChild(card);
    }
});

// 3. Подготовка DOM для динамического блока заказа
const orderLeft = document.querySelector('.order-left');
if (orderLeft) {
    // Удаляем статичные select-элементы
    orderLeft.querySelectorAll('select[name="soup"], select[name="main"], select[name="drink"]').forEach(select => {
        select.remove();
    });

    // Добавляем DOM-элементы для динамического отображения выбранных блюд и стоимости
    orderLeft.insertAdjacentHTML('afterbegin', `
        <div id="order-details">
            </div>
        <div id="total-cost" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ccc;">
            <p><strong>Стоимость заказа</strong></p>
            <p id="total-price-value" style="font-size: 1.2em; font-weight: bold;"></p>
        </div>
    `);
}
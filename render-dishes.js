// render-dishes.js — 100% РАБОЧАЯ ВЕРСИЯ

const categoryMap = {
    'soup': 'soup',
    'main-course': 'main',      // ← Исправлено!
    'salad': 'starter',         // ← Исправлено!
    'drink': 'drink',
    'dessert': 'dessert'
};

const categories = {
    soup:    document.querySelector('[data-category="soup"] .foods-grid'),
    main:    document.querySelector('[data-category="main"] .foods-grid'),     // ← Исправлено!
    starter: document.querySelector('[data-category="starter"] .foods-grid'), // ← Исправлено!
    drink:   document.querySelector('[data-category="drink"] .foods-grid'),
    dessert: document.querySelector('[data-category="dessert"] .foods-grid')
};

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.dataset.dish = dish.keyword;
    card.dataset.kind = dish.kind;

    const imgUrl = dish.image && dish.image.startsWith('http') ? dish.image : `https://edu.std-900.ist.mospolytech.ru${dish.image || ''}`;

    card.innerHTML = `
        <img src="${imgUrl}" alt="${dish.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Нет+фото'">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button type="button">Выбрать</button>
    `;

    return card;
}

function renderDishes() {
    if (!window.dishes || window.dishes.length === 0) return;

    // Очищаем все гриды
    Object.values(categories).forEach(grid => {
        if (grid) grid.innerHTML = '';
    });

    window.dishes.forEach(dish => {
        const catKey = categoryMap[dish.category];
        const grid = categories[catKey];

        if (grid && catKey) {
            grid.appendChild(createDishCard(dish));
        }
    });

    console.log('Блюда отрисованы успешно');
}
const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

const categories = {
  soup:    document.querySelector('[data-category="soup"] .foods-grid'),
  main:    document.querySelector('[data-category="main"] .foods-grid'),
  starter: document.querySelector('[data-category="starter"] .foods-grid'),
  drink:   document.querySelector('[data-category="drink"] .foods-grid'),
  dessert: document.querySelector('[data-category="dessert"] .foods-grid')
};

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.dataset.dish = dish.keyword;
    card.dataset.kind = dish.kind;   
    card.setAttribute('role', 'listitem');

    // Возвращаем оригинальный тег IMG (без заглушки)
    const img = `images/${dish.image}.webp`;

    card.innerHTML = `
        <img src="${img}" alt="${dish.name}">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button type="button">Выбрать</button>
    `;

    return card;
}

//Отрисовка всех блюд
sortedDishes.forEach(dish => {
  const grid = categories[dish.category];
  if (grid) grid.appendChild(createDishCard(dish));
});
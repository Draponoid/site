const categoryMap = {
    'soup': 'soup',
    'main-course': 'main-course',    
    'salad': 'salad',       
    'drink': 'drink',
    'dessert': 'dessert'
};


const categories = {
  soup:    document.querySelector('[data-category="soup"] .foods-grid'),
  'main-course': document.querySelector('[data-category="main-course"] .foods-grid'), 
  salad:   document.querySelector('[data-category="salad"] .foods-grid'),           
  drink:   document.querySelector('[data-category="drink"] .foods-grid'),
  dessert: document.querySelector('[data-category="dessert"] .foods-grid')
};


function createDishCard(dish) {
    const defaultImage = 'https://via.placeholder.com/400x220?text=Нет+фото';
    let imageUrl = dish.image;

    if (imageUrl && !imageUrl.startsWith('http') && window.API_BASE_URL) {
        imageUrl = `${window.API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    const finalImageUrl = imageUrl || defaultImage;
    const description = dish.description || 'Описание отсутствует.';
    const weightText = dish.weight ? `${dish.weight} г.` : 'Вес не указан';
    
    return `
        <div class="food-card" data-dish="${dish.keyword}" data-kind="${dish.kind}" role="listitem">
            <img src="${finalImageUrl}" alt="${dish.name}" loading="lazy" onerror="this.onerror=null;this.src='${defaultImage}';">
            <h4 class="name">${dish.name}</h4>
            <p class="weight">${dish.count}</p>
            <p class="description">${description}</p>
            <p class="price">${dish.price} ₽</p>
            <button type="button">Выбрать</button>
        </div>
    `;
}


function renderDishes() {
    console.log('Попытка отрисовки блюд...');
    
    if (!window.dishes || window.dishes.length === 0) {
        return;
    }
    
    Object.values(categories).forEach(grid => {
        if (grid) grid.innerHTML = '';
    });


    window.dishes.forEach(dish => {
        const categoryKey = categoryMap[dish.category]; 
        const grid = categories[categoryKey]; 
        
        if (grid) {
             grid.insertAdjacentHTML('beforeend', createDishCard(dish));
        }
    });

    if (typeof updateOrderDetails === 'function') {
        updateOrderDetails();
    }
}
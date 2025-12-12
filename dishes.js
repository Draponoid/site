// dishes.js
const API_KEY = '2fff1a57-5506-4824-9ebc-2167fa6dcbcf'; 
const API_URL_DISHES = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

window.API_BASE_URL = 'https://edu.std-900.ist.mospolytech.ru'; 
window.dishes = []; 
window.isDishesLoaded = false; // Флаг, что данные точно загрузились

async function loadDishes() {
    try {
        const response = await fetch(API_URL_DISHES); 
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        
        let data = await response.json();
        // Сортировка для удобства
        data.sort((a, b) => a.name.localeCompare(b.name));
        
        window.dishes = data;
        window.isDishesLoaded = true; // Ставим флаг
        console.log(`Загружено блюд: ${window.dishes.length}`);
        
        // Если мы на странице lunch.html (есть функция renderDishes), вызываем её
        if (typeof renderDishes === 'function') {
            renderDishes(); 
        } 
        
        // Инициализация фильтров
        if (typeof initializeFilters === 'function') {
            initializeFilters();
        }
        
        // Событие для других скриптов, что данные готовы
        document.dispatchEvent(new CustomEvent('dishesLoaded'));

    } catch (error) {
        console.error('Ошибка загрузки блюд:', error);
    }
}

loadDishes();
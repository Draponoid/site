// dishes.js
const API_KEY = '2fff1a57-5506-4824-9ebc-2167fa6dcbcf'; 
// Добавляем домен, чтобы работало с любого компьютера
const API_URL_DISHES = `https://edu.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=${API_KEY}`;

window.dishes = []; 
window.isDishesLoaded = false;

async function loadDishes() {
    try {
        const response = await fetch(API_URL_DISHES); 
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        
        let data = await response.json();
        // Сортировка по имени (A-Я)
        data.sort((a, b) => a.name.localeCompare(b.name));
        
        window.dishes = data;
        window.isDishesLoaded = true;
        console.log(`Загружено блюд: ${window.dishes.length}`);
        
        // Если функция отрисовки существует (мы на странице lunch.html)
        if (typeof renderDishes === 'function') {
            renderDishes(); 
        } 
        
        // Если фильтры существуют
        if (typeof initializeFilters === 'function') {
            initializeFilters();
        }
        
        // Сообщаем другим скриптам, что данные готовы
        document.dispatchEvent(new CustomEvent('dishesLoaded'));

    } catch (error) {
        console.error('Ошибка загрузки блюд:', error);
    }
}

loadDishes();
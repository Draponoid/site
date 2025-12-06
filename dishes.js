const API_KEY = '2fff1a57-5506-4824-9ebc-2167fa6dcbcf'; 
const API_URL_DISHES = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
const API_URL_ORDERS = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${API_KEY}`;
window.API_BASE_URL = 'https://edu.std-900.ist.mospolytech.ru'; 
window.dishes = []; 

/**
 * Асинхронная функция для загрузки блюд с API.
 */
async function loadDishes() {
    try {
        const response = await fetch(API_URL_DISHES); 
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        window.dishes = await response.json();
        console.log(`Успешно загружено блюд: ${window.dishes.length}`);
        
        if (typeof renderDishes === 'function') {
            renderDishes(); 
        } 
        
        if (typeof initializeFilters === 'function') {
            initializeFilters();
        }

    } catch (error) {
        console.error('КРИТИЧЕСКАЯ ОШИБКА: Не удалось загрузить данные о блюдах:', error);
        const main = document.querySelector('main');
        if (main) {
             main.innerHTML = '<h2 style="text-align:center; color:red; margin-top: 50px;">Ошибка загрузки меню. Пожалуйста, проверьте URL API и ваше интернет-соединение.</h2>';
        }
    }
}

loadDishes();
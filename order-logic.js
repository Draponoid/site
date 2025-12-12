// order-logic.js — ВЕРСИЯ С ПРОВЕРКОЙ КОМБО И URL

(function() {
    console.log('✅ order-logic.js ЗАПУЩЕН');

    const selectedDishes = {}; 
    const comboContainer = document.getElementById('combo-boxes-container');
    const orderPanel = document.getElementById('order-panel');
    const totalPriceEl = document.getElementById('total-price-panel');
    // Ищем кнопку перехода к заказу
    const orderLink = document.getElementById('order-link'); // Или ваша кнопка <a>

    const CAT_MAP = {
        'soup': 'soup',
        'main-course': 'main',
        'salad': 'starter',
        'drink': 'drink',
        'dessert': 'dessert'
    };

    // Все возможные комбинации для отображения
    const DISPLAY_COMBOS = [
        { name: 'Полный обед', items: ['soup', 'main', 'starter', 'drink'] },
        { name: 'Суп + Главное + Напиток', items: ['soup', 'main', 'drink'] },
        { name: 'Суп + Салат + Напиток', items: ['soup', 'starter', 'drink'] },
        { name: 'Главное + Салат + Напиток', items: ['main', 'starter', 'drink'] },
        { name: 'Главное + Напиток', items: ['main', 'drink'] },
        { name: 'Десерт', items: ['dessert'] }
    ];

    // ВАЛИДНЫЕ КОМБО (Без десерта, только еда)
    // Если собран один из этих наборов, кнопку можно активировать
    const VALID_COMBOS = [
        ['soup', 'main', 'starter', 'drink'],
        ['soup', 'main', 'drink'],
        ['soup', 'starter', 'drink'],
        ['main', 'starter', 'drink'],
        ['main', 'drink']
    ];

    function checkComboValidity() {
        const currentKeys = Object.keys(selectedDishes);
        
        // Проверяем, подходит ли текущий набор под одно из валидных комбо
        // (Десерт не учитываем для валидации, он идет бонусом)
        const isValid = VALID_COMBOS.some(requiredCats => {
            return requiredCats.every(cat => currentKeys.includes(cat));
        });

        return isValid;
    }

    function renderCombos() {
        if (!comboContainer) return;
        const currentKeys = Object.keys(selectedDishes);
        
        const html = DISPLAY_COMBOS.map(combo => {
            const isFull = combo.items.every(k => currentKeys.includes(k));
            return `
                <div class="combo-box ${isFull ? 'complete' : ''}" 
                     style="padding:15px; border:2px solid ${isFull ? '#4CAF50' : '#ddd'}; margin:5px; border-radius:12px; background:${isFull ? '#e8f5e9' : 'white'}; min-width:200px; text-align:center;">
                    <h4 style="margin:0 0 10px;">${combo.name}</h4>
                    <div>${isFull ? '✅ Собрано!' : '❌ Не собрано'}</div>
                </div>`;
        }).join('');
        
        comboContainer.innerHTML = `<div style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center;">${html}</div>`;
    }

    function updateOrderLink() {
        if (!orderLink) return;

        // 1. Формируем ссылку
        const params = new URLSearchParams();
        Object.entries(selectedDishes).forEach(([cat, dish]) => {
            if (dish) params.set(cat, dish.keyword);
        });
        const queryString = params.toString();
        orderLink.href = 'order.html?' + queryString;

        // 2. Проверяем валидность
        const isValid = checkComboValidity();

        if (isValid) {
            // Активируем кнопку
            orderLink.classList.remove('disabled');
            orderLink.style.pointerEvents = 'auto'; 
            orderLink.style.background = '#4a90e2'; // Синий
            orderLink.textContent = 'Оформить заказ';
        } else {
            // Блокируем кнопку
            orderLink.classList.add('disabled');
            orderLink.style.pointerEvents = 'none'; // Запрет клика
            orderLink.style.background = '#ccc';    // Серый
            orderLink.textContent = 'Не собрано комбо';
        }
    }

    function saveOrder() {
        // Просто обновляем ссылку, localStorage здесь вторичен
        updateOrderLink();
    }

    function updateView() {
        // Подсветка кнопок
        document.querySelectorAll('.food-card').forEach(card => {
            const kw = card.dataset.dish;
            const btn = card.querySelector('button');
            const isSelected = Object.values(selectedDishes).some(d => d.keyword === kw);
            
            if (isSelected) {
                card.classList.add('selected');
                card.style.border = "2px solid #4a90e2"; 
                if(btn) btn.textContent = 'Удалить';
            } else {
                card.classList.remove('selected');
                card.style.border = "none";
                if(btn) btn.textContent = 'Выбрать';
            }
        });

        // Панель (показываем, только если что-то выбрано)
        const total = Object.values(selectedDishes).reduce((acc, d) => acc + d.price, 0);
        if (orderPanel) {
            orderPanel.style.display = total > 0 ? 'block' : 'none';
            if (totalPriceEl) totalPriceEl.textContent = total;
        }

        renderCombos();
        updateOrderLink(); // Проверка валидности запускается здесь
    }

    // --- ОБРАБОТЧИК КЛИКА ---
    document.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const card = btn.closest('.food-card');
        if (!card) return;

        const keyword = card.dataset.dish;
        const dish = window.dishes.find(d => d.keyword === keyword);
        if (!dish) return;

        const myCat = CAT_MAP[dish.category];
        if (!myCat) return;

        if (selectedDishes[myCat] && selectedDishes[myCat].keyword === keyword) {
            delete selectedDishes[myCat];
        } else {
            selectedDishes[myCat] = dish;
        }

        updateView();
    });

    // --- ИНИЦИАЛИЗАЦИЯ ---
    const initInterval = setInterval(() => {
        if (window.dishes && window.dishes.length > 0) {
            clearInterval(initInterval);
            updateView();
            updateOrderLink();
        }
    }, 200);

})();
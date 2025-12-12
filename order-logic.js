// order-logic.js — ВЕРСИЯ ДЛЯ ЗАДАНИЯ (Strict LocalStorage)

(function() {
    console.log('✅ order-logic.js (Task Version) started');

    const selectedDishes = {}; // Здесь храним объекты, чтобы удобно отображать
    const comboContainer = document.getElementById('combo-boxes-container');
    const orderPanel = document.getElementById('order-panel');
    const totalPriceEl = document.getElementById('total-price-panel');
    const orderLink = document.getElementById('order-link');

    const CAT_MAP = {
        'soup': 'soup',
        'main-course': 'main',
        'salad': 'starter',
        'drink': 'drink',
        'dessert': 'dessert'
    };

    const DISPLAY_COMBOS = [
        { name: 'Полный обед', items: ['soup', 'main', 'starter', 'drink'] },
        { name: 'Суп + Главное + Напиток', items: ['soup', 'main', 'drink'] },
        { name: 'Суп + Салат + Напиток', items: ['soup', 'starter', 'drink'] },
        { name: 'Главное + Салат + Напиток', items: ['main', 'starter', 'drink'] },
        { name: 'Главное + Напиток', items: ['main', 'drink'] },
        { name: 'Десерт', items: ['dessert'] }
    ];

    // Валидные наборы для активации кнопки
    const VALID_COMBOS = [
        ['soup', 'main', 'starter', 'drink'],
        ['soup', 'main', 'drink'],
        ['soup', 'starter', 'drink'],
        ['main', 'starter', 'drink'],
        ['main', 'drink']
    ];

    // --- ГЛАВНОЕ ПО ЗАДАНИЮ: Сохранение в LocalStorage ---
    function saveToLocalStorage() {
        const dataToSave = {};
        
        // Проходим по выбранным блюдам и берем ТОЛЬКО их идентификаторы (keyword)
        Object.entries(selectedDishes).forEach(([category, dish]) => {
            if (dish) {
                dataToSave[category] = dish.keyword; // Сохраняем только ID (строку)
            }
        });

        // Записываем в хранилище строку JSON
        localStorage.setItem('lunchOrder', JSON.stringify(dataToSave));
        console.log('💾 Сохранено в LocalStorage (только ID):', dataToSave);
    }

    function checkComboValidity() {
        const currentKeys = Object.keys(selectedDishes);
        return VALID_COMBOS.some(combo => 
            combo.every(cat => currentKeys.includes(cat))
        );
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

    function updateView() {
        // Подсветка карточек
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

        // Панель цены
        const total = Object.values(selectedDishes).reduce((acc, d) => acc + d.price, 0);
        if (orderPanel) {
            orderPanel.style.display = total > 0 ? 'block' : 'none';
            if (totalPriceEl) totalPriceEl.textContent = total;
        }

        // Логика кнопки "Оформить"
        if (orderLink) {
            const isValid = checkComboValidity();
            if (isValid) {
                orderLink.classList.remove('disabled');
                orderLink.style.pointerEvents = 'auto';
                orderLink.style.background = '#4a90e2';
                orderLink.textContent = 'Оформить заказ';
                // Ссылка теперь просто ведет на страницу, без параметров
                orderLink.href = 'order.html'; 
            } else {
                orderLink.classList.add('disabled');
                orderLink.style.pointerEvents = 'none';
                orderLink.style.background = '#ccc';
                orderLink.textContent = 'Не собрано комбо';
            }
        }

        renderCombos();
    }

    // Обработчик клика
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

        saveToLocalStorage(); // Сохраняем ID при каждом изменении
        updateView();
    });

    // Инициализация (восстановление при перезагрузке)
    const initInterval = setInterval(() => {
        if (window.dishes && window.dishes.length > 0) {
            clearInterval(initInterval);
            
            const saved = localStorage.getItem('lunchOrder');
            if (saved) {
                try {
                    const data = JSON.parse(saved); // { soup: "g-soup", ... }
                    Object.entries(data).forEach(([cat, id]) => {
                        const d = window.dishes.find(item => item.keyword === id);
                        if (d) selectedDishes[cat] = d;
                    });
                } catch(e) { console.error(e); }
            }
            updateView();
        }
    }, 200);

})();
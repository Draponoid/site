// order-form-logic.js — ВЕРСИЯ ДЛЯ ЗАДАНИЯ (Читает LocalStorage)

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 [Order Page] Started');

    const DOM = {
        grid: document.getElementById('selected-grid'),
        noSelection: document.getElementById('no-selection'),
        detailsDiv: document.getElementById('order-details'),
        totalPrice: document.getElementById('total-price-value'),
        totalDiv: document.getElementById('total-cost'),
        form: document.getElementById('order-form')
    };

    // Те же валидные комбо для проверки перед отправкой
    const VALID_COMBOS = [
        ['soup', 'main', 'starter', 'drink'],
        ['soup', 'main', 'drink'],
        ['soup', 'starter', 'drink'],
        ['main', 'starter', 'drink'],
        ['main', 'drink']
    ];

    if (DOM.form) DOM.form.style.display = 'grid';

    // Получаем ID из LocalStorage
    function getOrderFromStorage() {
        try {
            const raw = localStorage.getItem('lunchOrder');
            if (raw && raw !== '{}') return JSON.parse(raw);
        } catch(e) {
            console.error(e);
        }
        return null;
    }

    function validateOrder(orderData) {
        if (!orderData) return false;
        const currentCats = Object.keys(orderData);
        return VALID_COMBOS.some(combo => 
            combo.every(cat => currentCats.includes(cat))
        );
    }

    // Ждем загрузки меню, чтобы превратить ID в картинки и цены
    const checkInterval = setInterval(() => {
        if (window.dishes && window.dishes.length > 0) {
            clearInterval(checkInterval);
            renderOrder(getOrderFromStorage());
        }
    }, 200);

    function renderOrder(orderIds) {
        if (!orderIds || Object.keys(orderIds).length === 0) {
            if (DOM.noSelection) DOM.noSelection.style.display = 'block';
            return;
        }

        const NAMES = { soup:'Суп', main:'Главное', starter:'Салат', drink:'Напиток', dessert:'Десерт' };
        let totalCost = 0;
        let itemsFound = 0;

        if (DOM.grid) DOM.grid.innerHTML = '';
        if (DOM.detailsDiv) DOM.detailsDiv.innerHTML = '';

        // Перебираем категории (soup, main...) и их ID
        Object.keys(orderIds).forEach(cat => {
            const id = orderIds[cat]; // Это keyword блюда
            const dish = window.dishes.find(d => d.keyword === id); // Ищем объект по ID
            
            if (!dish) return;

            itemsFound++;
            totalCost += dish.price;

            // Карточка
            if (DOM.grid) {
                const card = document.createElement('div');
                card.className = 'food-card';
                card.style.cssText = 'border:1px solid #ddd; padding:10px; border-radius:10px; display:flex; flex-direction:column; gap:10px;';
                
                const imgSrc = (dish.image && dish.image.startsWith('http')) 
                    ? dish.image 
                    : `https://edu.std-900.ist.mospolytech.ru${dish.image}`;

                card.innerHTML = `
                    <img src="${imgSrc}" style="width:100%; height:120px; object-fit:cover; border-radius:5px;">
                    <div style="font-weight:bold;">${dish.name}</div>
                    <div style="color:#e74c3c; font-weight:bold;">${dish.price} ₽</div>
                    <button class="del-btn" style="margin-top:auto; padding:8px; cursor:pointer; background:#ffeba0; border:none; border-radius:5px;">Удалить</button>
                `;

                // Удаление: обновляем LocalStorage и перерисовываем
                card.querySelector('.del-btn').addEventListener('click', () => {
                    const currentData = getOrderFromStorage();
                    delete currentData[cat];
                    localStorage.setItem('lunchOrder', JSON.stringify(currentData));
                    location.reload();
                });
                DOM.grid.appendChild(card);
            }

            // Чек
            if (DOM.detailsDiv) {
                DOM.detailsDiv.innerHTML += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px; border-bottom:1px solid #eee;">
                        <span>${NAMES[cat]}</span> <b>${dish.price} ₽</b>
                    </div>
                `;
            }
        });

        if (itemsFound > 0) {
            if (DOM.noSelection) DOM.noSelection.style.display = 'none';
            if (DOM.totalDiv) DOM.totalDiv.style.display = 'block';
            if (DOM.totalPrice) DOM.totalPrice.textContent = totalCost + ' ₽';
        }
    }

    // Отправка формы
    if (DOM.form) {
        DOM.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const orderIds = getOrderFromStorage();
            
            if (!validateOrder(orderIds)) {
                alert('Заказ неполный! Вы должны собрать комбо (Суп/Главное + Напиток).');
                return;
            }

            const fd = new FormData(DOM.form);
            // Добавляем ID блюд в форму
            Object.entries(orderIds).forEach(([cat, id]) => {
                fd.append(`selected_${cat}`, id); // отправляем keyword
            });

            try {
                const res = await fetch('https://httpbin.org/post', { method: 'POST', body: fd });
                if (res.ok) {
                    alert('Заказ успешно отправлен!');
                    localStorage.removeItem('lunchOrder'); // Очищаем корзину после заказа
                    location.href = 'site.html';
                }
            } catch (err) { alert('Ошибка сети'); }
        });
    }
});
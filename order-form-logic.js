// order-form-logic.js — ВЕРСИЯ С ЗАЩИТОЙ ОТ ОТПРАВКИ

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 [Order Page] Скрипт запущен');

    const DOM = {
        grid: document.getElementById('selected-grid'),
        noSelection: document.getElementById('no-selection'),
        detailsDiv: document.getElementById('order-details'),
        totalPrice: document.getElementById('total-price-value'),
        totalDiv: document.getElementById('total-cost'),
        form: document.getElementById('order-form')
    };

    // Валидные наборы (копии из logic.js)
    const VALID_COMBOS = [
        ['soup', 'main', 'starter', 'drink'],
        ['soup', 'main', 'drink'],
        ['soup', 'starter', 'drink'],
        ['main', 'starter', 'drink'],
        ['main', 'drink']
    ];

    if (DOM.form) DOM.form.style.display = 'grid';

    // Получаем данные из URL
    function getOrderData() {
        const params = new URLSearchParams(window.location.search);
        const fromUrl = {};
        let hasData = false;
        
        ['soup', 'main', 'starter', 'drink', 'dessert'].forEach(cat => {
            if (params.has(cat)) {
                fromUrl[cat] = params.get(cat);
                hasData = true;
            }
        });
        return hasData ? fromUrl : null;
    }

    // Проверка валидности заказа
    function validateOrder(orderData) {
        if (!orderData) return false;
        const currentCats = Object.keys(orderData);
        // Проверяем совпадение с любым валидным комбо
        return VALID_COMBOS.some(combo => 
            combo.every(cat => currentCats.includes(cat))
        );
    }

    const checkInterval = setInterval(() => {
        if (window.dishes && window.dishes.length > 0) {
            clearInterval(checkInterval);
            renderOrder(getOrderData());
        }
    }, 200);

    function renderOrder(orderData) {
        if (!orderData || Object.keys(orderData).length === 0) {
            if (DOM.noSelection) DOM.noSelection.style.display = 'block';
            return;
        }

        const NAMES = { soup:'Суп', main:'Главное', starter:'Салат', drink:'Напиток', dessert:'Десерт' };
        let totalCost = 0;
        let itemsFound = 0;

        if (DOM.grid) DOM.grid.innerHTML = '';
        if (DOM.detailsDiv) DOM.detailsDiv.innerHTML = '';

        Object.keys(orderData).forEach(cat => {
            const keyword = orderData[cat];
            const dish = window.dishes.find(d => d.keyword === keyword);
            if (!dish) return;

            itemsFound++;
            totalCost += dish.price;

            // Карточка
            if (DOM.grid) {
                const card = document.createElement('div');
                card.className = 'food-card';
                card.style.border = '1px solid #ddd';
                card.style.padding = '10px';
                card.style.borderRadius = '10px';
                
                const imgSrc = (dish.image && dish.image.startsWith('http')) 
                    ? dish.image 
                    : `https://edu.std-900.ist.mospolytech.ru${dish.image}`;

                card.innerHTML = `
                    <img src="${imgSrc}" style="width:100%; height:100px; object-fit:cover; border-radius:5px;">
                    <h4>${dish.name}</h4>
                    <p>${dish.price} ₽</p>
                    <button class="del-btn" style="cursor:pointer; background:#ffeba0; border:none; padding:5px;">Удалить</button>
                `;

                // Удаление (обновляет URL)
                card.querySelector('.del-btn').addEventListener('click', () => {
                    const params = new URLSearchParams(window.location.search);
                    params.delete(cat);
                    const newUrl = window.location.pathname + '?' + params.toString();
                    window.history.pushState({}, '', newUrl);
                    location.reload();
                });
                DOM.grid.appendChild(card);
            }

            // Чек
            if (DOM.detailsDiv) {
                DOM.detailsDiv.innerHTML += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
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

    // ОТПРАВКА ФОРМЫ С ПРОВЕРКОЙ
    if (DOM.form) {
        DOM.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const orderData = getOrderData();
            
            // 1. Проверяем валидность комбо
            if (!validateOrder(orderData)) {
                alert('Вы не собрали полный ланч!\nНужно минимум: Суп/Главное + Напиток.');
                return;
            }

            const fd = new FormData(DOM.form);
            Object.entries(orderData).forEach(([k, v]) => fd.append(`selected_${k}`, v));

            try {
                const res = await fetch('https://httpbin.org/post', { method: 'POST', body: fd });
                if (res.ok) {
                    alert('Заказ успешно оформлен!');
                    location.href = 'site.html';
                }
            } catch (err) { alert('Ошибка сети'); }
        });
    }
});
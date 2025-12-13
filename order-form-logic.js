// order-form-logic.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 [Order Page] Started');
    
    const API_KEY = '2fff1a57-5506-4824-9ebc-2167fa6dcbcf'; 
    // Полный адрес для отправки заказа
    const API_URL_ORDERS = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${API_KEY}`;

    const DOM = {
        grid: document.getElementById('selected-grid'),
        noSelection: document.getElementById('no-selection'),
        detailsDiv: document.getElementById('order-details'),
        totalPrice: document.getElementById('total-price-value'),
        totalDiv: document.getElementById('total-cost'),
        form: document.getElementById('order-form')
    };

    const VALID_COMBOS = [
        ['soup', 'main', 'starter', 'drink'],
        ['soup', 'main', 'drink'],
        ['soup', 'starter', 'drink'],
        ['main', 'starter', 'drink'],
        ['main', 'drink']
    ];

    if (DOM.form) DOM.form.style.display = 'grid';

    function getOrderFromStorage() {
        try {
            const raw = localStorage.getItem('lunchOrder');
            if (raw && raw !== '{}') return JSON.parse(raw);
        } catch(e) { console.error(e); }
        return null;
    }

    function validateOrder(orderData) {
        if (!orderData) return false;
        const currentCats = Object.keys(orderData);
        return VALID_COMBOS.some(combo => 
            combo.every(cat => currentCats.includes(cat))
        );
    }

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

        Object.keys(orderIds).forEach(cat => {
            const id = orderIds[cat]; 
            const dish = window.dishes.find(d => d.keyword === id); 
            
            if (!dish) return;

            itemsFound++;
            totalCost += dish.price;

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
                    <button class="del-btn" type="button" style="margin-top:auto; padding:8px; cursor:pointer; background:#ffeba0; border:none; border-radius:5px;">Удалить</button>
                `;

                card.querySelector('.del-btn').addEventListener('click', () => {
                    const currentData = getOrderFromStorage();
                    delete currentData[cat];
                    localStorage.setItem('lunchOrder', JSON.stringify(currentData));
                    location.reload();
                });
                DOM.grid.appendChild(card);
            }

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

    if (DOM.form) {
        DOM.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const orderIds = getOrderFromStorage(); 
            
            if (!validateOrder(orderIds)) {
                alert('Заказ неполный! Соберите комбо (Суп/Главное + Напиток).');
                return;
            }

            const fd = new FormData(DOM.form);

            const mapCategoryToApiField = {
                'soup': 'soup_id',
                'main': 'main_course_id',
                'starter': 'salad_id',
                'drink': 'drink_id',
                'dessert': 'dessert_id'
            };

            Object.entries(orderIds).forEach(([catKey, keyword]) => {
                const dishObj = window.dishes.find(d => d.keyword === keyword);
                const apiFieldName = mapCategoryToApiField[catKey];
                
                if (dishObj && apiFieldName) {
                    fd.append(apiFieldName, dishObj.id); 
                }
            });

            try {
                const res = await fetch(API_URL_ORDERS, { 
                    method: 'POST', 
                    body: fd 
                });
                
                if (res.ok) {
                    const notif = document.createElement('div');
                    notif.style.cssText = "position:fixed; top:20px; right:20px; background:#4CAF50; color:white; padding:20px; z-index:9999; border-radius:5px; box-shadow:0 0 10px rgba(0,0,0,0.5);";
                    notif.textContent = "Заказ успешно оформлен!";
                    document.body.appendChild(notif);

                    localStorage.removeItem('lunchOrder'); 
                    
                    setTimeout(() => {
                        location.href = 'orders.html'; 
                    }, 1500);
                    
                } else {
                    const errText = await res.text();
                    alert(`Ошибка сервера: ${errText}`);
                }
            } catch (err) { 
                console.error(err);
                alert('Ошибка сети или сервера'); 
            }
        });
    }
});
// order-form-logic.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 [Order Page] Загрузка...');
    
    const API_KEY = '2fff1a57-5506-4824-9ebc-2167fa6dcbcf'; 
    const API_URL = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${API_KEY}`;

    // Названия категорий для вывода
    const CAT_NAMES = {
        soup: 'Суп',
        main: 'Главное блюдо',
        starter: 'Салат / Стартер',
        drink: 'Напиток',
        dessert: 'Десерт'
    };

    // DOM Элементы
    const cardsGrid = document.getElementById('cards-grid');
    const summaryList = document.getElementById('order-summary-list');
    const totalPriceEl = document.getElementById('total-price-sum');
    const emptyMsg = document.getElementById('empty-message');
    const form = document.getElementById('order-form');

    // Функция чтения из LocalStorage
    function getOrder() {
        try {
            const raw = localStorage.getItem('lunchOrder');
            return raw ? JSON.parse(raw) : {};
        } catch(e) { return {}; }
    }

    // Ждем загрузки данных о блюдах
    const checkInterval = setInterval(() => {
        if (window.dishes && window.dishes.length > 0) {
            clearInterval(checkInterval);
            renderAll();
        }
    }, 200);

    function renderAll() {
        const orderData = getOrder();
        const cats = Object.keys(orderData);
        
        // Очистка
        cardsGrid.innerHTML = '';
        summaryList.innerHTML = '';

        if (cats.length === 0) {
            emptyMsg.style.display = 'block';
            form.style.display = 'none'; // Скрываем форму, если пусто
            return;
        } else {
            emptyMsg.style.display = 'none';
            form.style.display = 'grid';
        }

        let total = 0;

        // Порядок вывода (как на макете)
        const orderPriority = ['soup', 'main', 'starter', 'drink', 'dessert'];
        
        // Сортируем категории для вывода
        const sortedCats = cats.sort((a, b) => orderPriority.indexOf(a) - orderPriority.indexOf(b));

        sortedCats.forEach(cat => {
            const keyword = orderData[cat];
            const dish = window.dishes.find(d => d.keyword === keyword);
            if (!dish) return;

            total += dish.price;

            // 1. РЕНДЕР КАРТОЧКИ (ВЕРХ)
            const card = document.createElement('div');
            card.className = 'order-card';
            const img = dish.image.startsWith('http') ? dish.image : `https://edu.std-900.ist.mospolytech.ru${dish.image}`;
            
            card.innerHTML = `
                <img src="${img}" alt="${dish.name}">
                <div class="card-price">${dish.price}₽</div>
                <div class="card-name">${dish.name}</div>
                <div class="card-weight">${dish.count}</div>
                <button type="button" class="delete-btn">Удалить</button>
            `;

            // Удаление
            card.querySelector('.delete-btn').addEventListener('click', () => {
                removeItem(cat);
            });
            cardsGrid.appendChild(card);

            // 2. РЕНДЕР СПИСКА (НИЗ, СЛЕВА)
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <div class="summary-cat">${CAT_NAMES[cat] || cat}</div>
                <div class="summary-name">${dish.name} <b style="margin-left:5px;">${dish.price}₽</b></div>
            `;
            summaryList.appendChild(summaryItem);
        });

        // Итого
        if (totalPriceEl) totalPriceEl.textContent = total + '₽';
    }

    function removeItem(category) {
        const data = getOrder();
        delete data[category];
        localStorage.setItem('lunchOrder', JSON.stringify(data));
        renderAll(); // Перерисовка всего
    }

    // ОТПРАВКА ФОРМЫ
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const orderData = getOrder();
            
            if (Object.keys(orderData).length === 0) {
                alert('Корзина пуста');
                return;
            }

            const fd = new FormData(form);

            // Добавляем ID блюд
            const apiFields = {
                soup: 'soup_id',
                main: 'main_course_id',
                starter: 'salad_id',
                drink: 'drink_id',
                dessert: 'dessert_id'
            };

            Object.keys(orderData).forEach(cat => {
                const keyword = orderData[cat];
                const dish = window.dishes.find(d => d.keyword === keyword);
                if (dish && apiFields[cat]) {
                    fd.append(apiFields[cat], dish.id);
                }
            });

            try {
                const res = await fetch(API_URL, { method: 'POST', body: fd });
                if (res.ok) {
                    const notif = document.createElement('div');
                    notif.textContent = "Заказ успешно оформлен!";
                    notif.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; border:2px solid green; padding:30px; z-index:9999; border-radius:10px; font-size:18px;";
                    document.body.appendChild(notif);
                    
                    localStorage.removeItem('lunchOrder');
                    setTimeout(() => window.location.href = 'orders.html', 2000);
                } else {
                    const err = await res.json();
                    alert('Ошибка: ' + (err.error || 'Неизвестная ошибка'));
                }
            } catch (e) {
                alert('Ошибка сети');
            }
        });
    }
});
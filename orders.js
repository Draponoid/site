// orders.js

const API_KEY_ORDERS = '2fff1a57-5506-4824-9ebc-2167fa6dcbcf'; 

// Полный путь для GET запроса
const API_URL_GET_ORDERS = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${API_KEY_ORDERS}`;

// Полный базовый путь для действий (PUT/DELETE)
const API_BASE_ACTION = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders`; 

let allOrders = [];

function initOrdersPage() {
    if (window.isDishesLoaded) {
        loadOrders();
    } else {
        document.addEventListener('dishesLoaded', loadOrders);
        const waitInterval = setInterval(() => {
            if (window.isDishesLoaded) {
                clearInterval(waitInterval);
                loadOrders();
            }
        }, 500);
    }
}

initOrdersPage();

async function loadOrders() {
    try {
        const response = await fetch(API_URL_GET_ORDERS);
        if (!response.ok) throw new Error('Ошибка загрузки заказов');
        
        allOrders = await response.json();
        // Сортировка: новые сверху
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        renderOrdersTable();
    } catch (error) {
        showNotification('Не удалось загрузить заказы: ' + error.message, true);
    }
}

function getDishName(id) {
    const dish = window.dishes.find(d => d.id === id);
    return dish ? dish.name : 'Блюдо удалено';
}

function getDishPrice(id) {
    const dish = window.dishes.find(d => d.id === id);
    return dish ? dish.price : 0;
}

function calculateCost(ids) {
    return ids.reduce((sum, id) => sum + getDishPrice(id), 0);
}

function formatDateTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('ru-RU', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    }).replace(',', '');
}

function renderOrdersTable() {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';

    if (allOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">История заказов пуста</td></tr>';
        return;
    }

    allOrders.forEach((order, index) => {
        const tr = document.createElement('tr');
        
        const dishIds = [
            order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id
        ].filter(id => id);
        
        const compositionString = dishIds.map(id => getDishName(id)).join(', ');
        const cost = calculateCost(dishIds);
        
        const deliveryText = order.delivery_type === 'now' 
            ? 'Как можно скорее (с 07:00 до 23:00)' 
            : order.delivery_time;

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatDateTime(order.created_at)}</td>
            <td title="${compositionString}" style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${compositionString}
            </td>
            <td>${cost} ₽</td>
            <td>${deliveryText}</td>
            <td>
                <button class="actions-btn" onclick="openViewModal(${order.id})">👁️</button>
                <button class="actions-btn" onclick="openEditModal(${order.id})">✏️</button>
                <button class="actions-btn" onclick="openDeleteModal(${order.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- УВЕДОМЛЕНИЯ ---
const notification = document.getElementById('notification');
function showNotification(msg, isError = false) {
    notification.textContent = msg;
    notification.className = 'notification' + (isError ? ' error' : '');
    notification.style.display = 'block';
    setTimeout(() => { notification.style.display = 'none'; }, 3000);
}

// --- МОДАЛЬНЫЕ ОКНА ---
const modalView = document.getElementById('modal-view');
const modalEdit = document.getElementById('modal-edit');
const modalDelete = document.getElementById('modal-delete');
let currentDeleteId = null;

document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        modalView.style.display = 'none';
        modalEdit.style.display = 'none';
        modalDelete.style.display = 'none';
    });
});

// 1. ПРОСМОТР
window.openViewModal = function(id) {
    const order = allOrders.find(o => o.id === id);
    if (!order) return;

    const dishIds = [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id].filter(x => x);
    const content = document.getElementById('view-content');
    
    let dishesHtml = '';
    dishIds.forEach(dId => {
        const d = window.dishes.find(item => item.id === dId);
        if(d) dishesHtml += `<p>${d.name} <strong>(${d.price}₽)</strong></p>`;
    });

    const cost = calculateCost(dishIds);

    content.innerHTML = `
        <div class="modal-row"><label>Дата оформления</label> <p>${formatDateTime(order.created_at)}</p></div>
        <h4 style="margin:15px 0 10px; color:#4a90e2;">Доставка</h4>
        <div class="modal-row"><label>Имя</label> <p>${order.full_name}</p></div>
        <div class="modal-row"><label>Адрес</label> <p>${order.delivery_address}</p></div>
        <div class="modal-row"><label>Время доставки</label> <p>${order.delivery_type === 'now' ? 'Как можно скорее' : order.delivery_time}</p></div>
        <div class="modal-row"><label>Телефон</label> <p>${order.phone}</p></div>
        <div class="modal-row"><label>Email</label> <p>${order.email}</p></div>
        <div class="modal-row"><label>Комментарий</label> <p>${order.comment || '-'}</p></div>
        <h4 style="margin:15px 0 10px; color:#4a90e2;">Состав заказа</h4>
        ${dishesHtml}
        <div class="modal-row" style="margin-top:15px; border-top:2px solid #ddd; padding-top:10px;">
            <label>Итоговая стоимость:</label> <p style="font-size:18px; font-weight:bold;">${cost}₽</p>
        </div>
    `;
    modalView.style.display = 'flex';
};

// 2. УДАЛЕНИЕ
window.openDeleteModal = function(id) {
    currentDeleteId = id;
    modalDelete.style.display = 'flex';
};

document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    if (!currentDeleteId) return;
    try {
        // DELETE https://.../labs/api/orders/{id}
        const url = `${API_BASE_ACTION}/${currentDeleteId}?api_key=${API_KEY_ORDERS}`;
        const response = await fetch(url, { method: 'DELETE' });
        
        if (!response.ok) throw new Error('Ошибка удаления');
        
        showNotification('Заказ успешно удален');
        modalDelete.style.display = 'none';
        loadOrders(); 
    } catch (e) {
        showNotification(e.message, true);
    }
});

// 3. РЕДАКТИРОВАНИЕ
window.openEditModal = function(id) {
    const order = allOrders.find(o => o.id === id);
    if (!order) return;

    const form = document.getElementById('edit-form');
    form.id.value = order.id;
    document.getElementById('edit-created-at').textContent = formatDateTime(order.created_at);
    
    form.full_name.value = order.full_name;
    form.delivery_address.value = order.delivery_address;
    form.email.value = order.email;
    form.phone.value = order.phone;
    form.comment.value = order.comment || '';
    
    if (order.delivery_type === 'now') {
        form.querySelector('input[value="now"]').checked = true;
    } else {
        form.querySelector('input[value="by_time"]').checked = true;
    }
    form.delivery_time.value = order.delivery_time || '';

    const dishIds = [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id].filter(x => x);
    const dishesListHtml = dishIds.map(dId => {
        const d = window.dishes.find(item => item.id === dId);
        return d ? `<p>${d.name}</p>` : '';
    }).join('');
    
    document.getElementById('edit-order-composition').innerHTML = dishesListHtml;

    modalEdit.style.display = 'flex';
};

// Сохранение редактирования
document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const id = fd.get('id');
    
    try {
        // PUT https://.../labs/api/orders/{id}
        const url = `${API_BASE_ACTION}/${id}?api_key=${API_KEY_ORDERS}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            body: fd 
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Ошибка обновления');
        }

        showNotification('Заказ успешно изменен');
        modalEdit.style.display = 'none';
        loadOrders();
    } catch (err) {
        showNotification(err.message, true);
    }
});
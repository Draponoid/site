const selectedDishes = {};  
const orderDetailsDiv = document.getElementById('order-details');
const totalCostDiv = document.getElementById('total-cost');
const totalPriceValueP = document.getElementById('total-price-value');
const orderForm = document.querySelector('.order-form');

const comboBoxesContainer = document.getElementById('combo-boxes-container');
const modalOverlay = document.getElementById('combo-modal');
const modalMessage = document.getElementById('modal-message');
const modalCloseBtn = document.getElementById('modal-close-btn');


const categoryTitles = {
  soup:    'Суп',
  'main-course': 'Главное блюдо', 
  salad: 'Салат/Стартер',                   
  drink:   'Напиток',
  dessert: 'Десерт'
};

const categoryEmojis = {
    soup:         '🍲',
    'main-course':'🍛',
    salad:        '🥗',
    drink:        '🥤',
    dessert:      '🍰'
};

const COMBO_DEFINITIONS = [
    { name: 'Полный Комбо', required: ['soup', 'main-course', 'salad', 'drink'] }, 
    { name: 'Комбо 2 (Суп+Основное+Напиток)', required: ['soup', 'main-course', 'drink'] }, 
    { name: 'Комбо 3 (Суп+Салат+Напиток)', required: ['soup', 'salad', 'drink'] },                   
    { name: 'Комбо 4 (Основное+Салат+Напиток)', required: ['main-course', 'salad', 'drink'] },            
    { name: 'Комбо 5 (Основное+Напиток)', required: ['main-course', 'drink'] },                     
    { name: 'Десерт', required: ['dessert'] } 
];

// === обновление скрытых полей для отправки === 
function updateHiddenFields() {
    document.querySelectorAll('input[name="dishes[]"]').forEach(el => el.remove());

    // Проходим по всем выбранным блюдам
    Object.values(selectedDishes).forEach(dish => {
        if (dish && dish.keyword && dish.price) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'dishes[]'; 
            input.value = `${dish.keyword},${dish.price}`;  
            orderForm.appendChild(input);
        }
    });

    // Также отправляем общую сумму (по желанию, можно оставить)
    let totalInput = document.querySelector('input[name="total_price"]');
    if (!totalInput) {
        totalInput = document.createElement('input');
        totalInput.type = 'hidden';
        totalInput.name = 'total_price';
        orderForm.appendChild(totalInput);
    }
    totalInput.value = totalPriceValueP.textContent.replace('₽', '').trim();
}

function updateOrderDetails() {
  let total = 0;
  let html = '';

  renderComboBoxes();
  
  const hasAny = Object.values(selectedDishes).some(d => d);

  if (!hasAny) {
    orderDetailsDiv.innerHTML = '<p>Ничего не выбрано</p>';
    totalCostDiv.style.display = 'none';
    return;
  }

  totalCostDiv.style.display = 'block';

  const comboDetailsMessage = checkComboDetails(new Set(
      Object.keys(selectedDishes).filter(cat => selectedDishes[cat])
  ));

  if (comboDetailsMessage) {
    html += comboDetailsMessage; 
    html += '<hr style="margin: 10px 0; border-color:#ccc;">';
  }
  
  Object.keys(categoryTitles).forEach(cat => {
    const dish = selectedDishes[cat];
    html += `<p style="margin:6px 0;"><strong>${categoryTitles[cat]}</strong></p>`;
    if (dish) {
      html += `<p style="margin:0 0 10px 0;">${dish.name} — ${dish.price}₽</p>`;
      total += dish.price;
    } else {
      html += `<p style="margin:0 0 10px 0;color:#999;">Не выбрано</p>`;
    }
  });

  orderDetailsDiv.innerHTML = html;
  totalPriceValueP.textContent = total + '₽';

  updateHiddenFields();
}

// === Выбор блюда ===
document.addEventListener('click', e => {
  const btn = e.target.closest('.food-card button');
  if (!btn) return;

  const card = btn.closest('.food-card');
  const keyword = card.dataset.dish;
  const dish = window.dishes.find(d => d.keyword === keyword);
  if (!dish) return;

  const categoryMap = {
    'soup': 'soup',
    'main-course': 'main-course',
    'salad': 'salad',
    'drink': 'drink',
    'dessert': 'dessert'
  };
  
  const category = categoryMap[dish.category] || dish.category;

  document.querySelectorAll(`.food-section[data-category="${category}"] .food-card.selected`)
    .forEach(c => c.classList.remove('selected'));

  card.classList.add('selected');
  selectedDishes[category] = dish;

  updateOrderDetails();
});

document.querySelector('.btn-reset')?.addEventListener('click', () => {
  setTimeout(() => { 
    Object.keys(selectedDishes).forEach(k => delete selectedDishes[k]);
    document.querySelectorAll('.food-card.selected').forEach(c => c.classList.remove('selected'));
    updateOrderDetails();
  }, 0);
});


function renderComboBoxes() {
    if (!comboBoxesContainer) return;
    let html = '';

    COMBO_DEFINITIONS.forEach(combo => {
        const missing = combo.required.filter(cat => !selectedDishes[cat]);
        const isComplete = missing.length === 0;

        html += `<div class="combo-box ${isComplete ? 'complete' : ''}">
            <h4>${combo.name}</h4>`;

        combo.required.forEach(cat => {
            const dish = selectedDishes[cat];
            const emoji = categoryEmojis[cat] || '';
            if (dish) {
                html += `<div class="combo-item">
                    <div class="dish-placeholder-small">${emoji}</div>
                    <div class="combo-item-title">${dish.name}</div>
                </div>`;
            } else {
                html += `<div class="combo-item missing-item">
                    <div class="dish-placeholder-small">${emoji}</div>
                    <div class="combo-item-title">${categoryTitles[cat]}</div>
                </div>`;
            }
        });

        if (isComplete) {
            html += `<p style="color:#4CAF50;font-weight:bold;margin:10px 0 0;">Комбо собрано!</p>`;
        }

        html += `</div>`;
    });

    comboBoxesContainer.innerHTML = html;
}

function checkComboDetails(selectedCategories) {
    const matched = COMBO_DEFINITIONS.filter(combo => 
        combo.required.every(cat => selectedCategories.has(cat))
    );

    if (matched.length > 0) {
        const names = matched.map(c => c.name).join(', ');
        return `<p style="background:#e8f5e9;padding:10px;border-radius:8px;">
                  <strong>Ура! Вы собрали:</strong> ${names}
                </p>`;
    }
    return '';
}

function hideModal() {
    modalOverlay.style.display = 'none';
}

modalCloseBtn.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) hideModal();
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateOrderDetails();
});
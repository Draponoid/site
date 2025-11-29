const selectedDishes = {};  

const orderDetailsDiv = document.getElementById('order-details');
const totalCostDiv = document.getElementById('total-cost');
const totalPriceValueP = document.getElementById('total-price-value');
const orderForm = document.querySelector('.order-form');

// НОВЫЕ ЭЛЕМЕНТЫ: Модальное окно и контейнер для комбо
const comboBoxesContainer = document.getElementById('combo-boxes-container');
const modalOverlay = document.getElementById('combo-modal');
const modalMessage = document.getElementById('modal-message');
const modalCloseBtn = document.getElementById('modal-close-btn');

const categoryTitles = {
  soup:    'Суп',
  main:    'Главное блюдо',
  starter: 'Салат/стартер',
  drink:   'Напиток',
  dessert: 'Десерт'
};

// Определение эмодзи
const categoryEmojis = {
    soup:    '🍜', // Суп
    main:    '🍝', // Главное блюдо
    starter: '🥗', // Салат/стартер
    drink:   '🥤', // Напиток
    dessert: '🍰'  // Десерт
};

// Определение комбо (Полный, 2, 3, 4, 5) + дополнительный блок "Десерт"
const COMBO_DEFINITIONS = [
    { name: 'Полный Комбо', required: ['soup', 'main', 'starter', 'drink'] },
    { name: 'Комбо 2', required: ['soup', 'main', 'drink'] },
    { name: 'Комбо 3', required: ['soup', 'starter', 'drink'] },
    { name: 'Комбо 4', required: ['main', 'starter', 'drink'] },
    { name: 'Комбо 5', required: ['main', 'drink'] },
    { name: 'Десерт', required: ['dessert'] } 
];

// --- ЛОГИКА МОДАЛЬНЫХ ОКОН ---
function showModal(message) {
    modalMessage.textContent = message;
    modalOverlay.style.display = 'flex';
}

function hideModal() {
    modalOverlay.style.display = 'none';
}

modalCloseBtn.addEventListener('click', hideModal);



// --- Генерация комбо-боксов ---
function renderComboBoxes() {
    if (!comboBoxesContainer) return;

    const presentCategories = new Set(
        Object.keys(selectedDishes).filter(cat => selectedDishes[cat])
    );

    let boxesHTML = '';

    COMBO_DEFINITIONS.forEach((combo) => {
        let isMatch = true;
        let comboItemsHTML = '';
        
        
        const isMainCombo = combo.name !== 'Десерт';
        const requiredCategories = combo.required.filter(cat => cat !== 'dessert');
        
        // Проверка на полное совпадение
        const hasExtra = isMainCombo && [...presentCategories].some(cat => !requiredCategories.includes(cat) && cat !== 'dessert');
        const isAllRequiredPresent = combo.required.every(cat => presentCategories.has(cat));
        
        if (hasExtra || !isAllRequiredPresent) {
            isMatch = false;
        }

        // Генерация элементов комбо
        combo.required.forEach(cat => {
            const isPresent = presentCategories.has(cat);
            const statusClass = isPresent ? '' : 'missing-item';
            const title = categoryTitles[cat] || cat;
            
            if (isMainCombo && !isPresent) {
                 isMatch = false;
            }

            
            const emoji = categoryEmojis[cat] || '❓';
            comboItemsHTML += `
                <div class="combo-item ${statusClass}">
                    <div class="dish-placeholder-small" style="font-size: 30px;">${emoji}</div>
                    <span class="combo-item-title">${title}</span>
                </div>
            `;
        });
        
        const completeClass = isMatch && isAllRequiredPresent ? 'complete' : '';

        boxesHTML += `
            <div class="combo-box ${completeClass}">
                <h4>${combo.name}</h4>
                <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                    ${comboItemsHTML}
                </div>
            </div>
        `;
    });

    comboBoxesContainer.innerHTML = boxesHTML;
    
    return checkComboDetails(presentCategories);
}

// Вспомогательная функция для генерации подсказки в блоке заказа 
function checkComboDetails(presentCategories) {
    let isAnyComboAchieved = false;
    let closestCombo = null;
    let minMissing = Infinity;

    COMBO_DEFINITIONS.filter(c => c.name !== 'Десерт').forEach((combo) => {
        let missing = [];
        combo.required.forEach(cat => {
            if (!presentCategories.has(cat)) {
                missing.push(cat);
            }
        });
        
        const hasExtra = [...presentCategories].some(cat => !combo.required.includes(cat) && cat !== 'dessert');
        const isMatch = (missing.length === 0) && !hasExtra;

        if (isMatch) {
            isAnyComboAchieved = true;
        }

        if (!hasExtra && presentCategories.size >= 2 && missing.length < minMissing) {
            minMissing = missing.length;
            closestCombo = { name: combo.name, missing: missing };
        }
    });

    let comboMessage = '';

    if (isAnyComboAchieved) {
        comboMessage = `<p style="color:green;font-weight:bold;margin-bottom:10px;"> Вы собрали как минимум одно комбо!</p>`;
    } else if (presentCategories.size > 0) {
        if (closestCombo && closestCombo.missing.length > 0) {
            const missingTitles = closestCombo.missing.map(cat => categoryTitles[cat]).join(', ');
            comboMessage = `<p style="color:orange;font-weight:bold;margin-bottom:10px;">
                Вы близки к "${closestCombo.name}"! Не хватает: ${missingTitles}
            </p>`;
        } else {
            comboMessage = `<p style="color:red;font-weight:bold;margin-bottom:10px;">
                Ваш выбор не соответствует ни одному из комбо.
            </p>`;
        }
    }
    
    // Сообщение о десерте, если он не выбран
    if (!selectedDishes.dessert && presentCategories.size > 0) {
        comboMessage += `<p style="color:#666;font-style:italic;margin-top:10px;"> Не забудьте про десерт!</p>`;
    }

    return comboMessage;
}



// --- ЛОГИКА ПРОВЕРКИ И УВЕДОМЛЕНИЙ ПЕРЕД ОТПРАВКОЙ ---
function validateComboOnSubmit(e) {
    const presentCategories = new Set(
        Object.keys(selectedDishes).filter(cat => selectedDishes[cat] && cat !== 'dessert')
    );

    const hasSoup = presentCategories.has('soup');
    const hasMain = presentCategories.has('main');
    const hasStarter = presentCategories.has('starter');
    const hasDrink = presentCategories.has('drink');
    const hasDessert = selectedDishes['dessert'] ? true : false;
    const hasAny = presentCategories.size > 0 || hasDessert;
    
        if (!hasAny) {
        e.preventDefault();
        showModal('Ничего не выбрано. Выберите блюда для заказа');
        return false;
    }
    
    
    if ((hasSoup && hasMain && hasStarter) && !hasDrink) {
        e.preventDefault();
        showModal('Выберите напиток');
        return false;
    }
    
   
    if (hasSoup && !hasMain && !hasStarter && !hasDrink) {
        e.preventDefault();
        showModal('Выберите главное блюдо/салат/стартер');
        return false;
    }
    
    
    if (hasStarter && !hasSoup && !hasMain && !hasDrink) {
        e.preventDefault();
        showModal('Выберите суп или главное блюдо');
        return false;
    }

    
    if (!hasSoup && !hasMain && !hasStarter && (hasDrink || hasDessert)) {
         e.preventDefault();
         showModal('Выберите главное блюдо');
         return false;
    }
    
    // Заказ проходит, если собрано достаточно блюд.
    return true; 
}


// --- ОСНОВНЫЕ ФУНКЦИИ ---

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

  let comboMessage = ' Выберите блюда, чтобы собрать комбо, или оформите индивидуальный заказ.';
  
  const comboDetailsMessage = checkComboDetails(new Set(
      Object.keys(selectedDishes).filter(cat => selectedDishes[cat] && cat !== 'dessert')
  ));

  if (comboDetailsMessage) {
    html += comboDetailsMessage; // Вставляем подсказку
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
}

function updateHiddenFields() {
  orderForm.querySelectorAll('input[name^="selected_"]').forEach(i => i.remove());
  Object.keys(selectedDishes).forEach(cat => {
    const dish = selectedDishes[cat];
    if (dish) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `selected_${cat}`;
      input.value = dish.keyword;
      orderForm.appendChild(input);
    }
  });
}

updateOrderDetails();
updateHiddenFields();

// --- ПЕРЕХВАТ ОТПРАВКИ ФОРМЫ ---
orderForm.addEventListener('submit', validateComboOnSubmit);

document.addEventListener('click', e => {
  const btn = e.target.closest('.food-card button');
  if (!btn) return;

  const card = btn.closest('.food-card');
  const keyword = card.dataset.dish;
  
  if (typeof dishes === 'undefined') {
      console.error("Массив dishes не определен. Проверьте подключение dishes.js перед order-logic.js.");
      return;
  }
  
  const dish = dishes.find(d => d.keyword === keyword);
  if (!dish) return;

  const category = dish.category;

  if (selectedDishes[category]) {
    const prevCard = document.querySelector(`.food-card[data-dish="${selectedDishes[category].keyword}"]`);
    if (prevCard) prevCard.classList.remove('selected');
  }

  card.classList.add('selected');
  selectedDishes[category] = dish;

  updateOrderDetails();
  updateHiddenFields();
});


document.querySelector('.btn-reset')?.addEventListener('click', () => {
  Object.keys(selectedDishes).forEach(k => delete selectedDishes[k]);
  document.querySelectorAll('.food-card.selected').forEach(c => c.classList.remove('selected'));
  updateOrderDetails();
  updateHiddenFields();
});
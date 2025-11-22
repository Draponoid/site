const selectedDishes = {};   // { soup: dishObj, main: ..., starter: ..., drink: ..., dessert: ... }

const orderDetailsDiv = document.getElementById('order-details');
const totalCostDiv = document.getElementById('total-cost');
const totalPriceValueP = document.getElementById('total-price-value');
const orderForm = document.querySelector('.order-form');

const categoryTitles = {
  soup:    'Суп',
  main:    'Главное блюдо',
  starter: 'Салат/стартер',
  drink:   'Напиток',
  dessert: 'Десерт'
};

function updateOrderDetails() {
  let total = 0;
  let html = '';

  const hasAny = Object.values(selectedDishes).some(d => d);

  if (!hasAny) {
    orderDetailsDiv.innerHTML = '<p>Ничего не выбрано</p>';
    totalCostDiv.style.display = 'none';
    return;
  }

  totalCostDiv.style.display = 'block';

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

// Обработчик кнопок "Выбрать"
document.addEventListener('click', e => {
  const btn = e.target.closest('.food-card button');
  if (!btn) return;

  const card = btn.closest('.food-card');
  const keyword = card.dataset.dish;
  const dish = dishes.find(d => d.keyword === keyword);
  if (!dish) return;

  const category = dish.category;

  // Снимаем выделение с предыдущего в этой категории
  if (selectedDishes[category]) {
    const prevCard = document.querySelector(`.food-card[data-dish="${selectedDishes[category].keyword}"]`);
    if (prevCard) prevCard.classList.remove('selected');
  }

  // Выделяем текущую карточку
  card.classList.add('selected');
  selectedDishes[category] = dish;

  updateOrderDetails();
  updateHiddenFields();
});

// Сброс формы
document.querySelector('.btn-reset')?.addEventListener('click', () => {
  Object.keys(selectedDishes).forEach(k => delete selectedDishes[k]);
  document.querySelectorAll('.food-card.selected').forEach(c => c.classList.remove('selected'));
  updateOrderDetails();
  updateHiddenFields();
});
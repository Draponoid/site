// order-logic.js
(function() {
    console.log('✅ [Logic] Combo System Initialized');

    const STORAGE_KEY = 'lunchOrder';
    const selectedDishes = {}; 

    const CATEGORY_MAP = {
        'soup': 'soup',
        'main-course': 'main',
        'salad': 'starter',
        'drink': 'drink',
        'dessert': 'dessert'
    };

    // Define the valid combos exactly as per requirements
    // 1. Soup + Main + Salad + Drink
    // 2. Soup + Main + Drink
    // 3. Soup + Salad + Drink
    // 4. Main + Salad + Drink
    // 5. Main + Drink
    const COMBOS = [
        { id: 'c1', items: ['soup', 'main', 'starter', 'drink'] },
        { id: 'c2', items: ['soup', 'main', 'drink'] },
        { id: 'c3', items: ['soup', 'starter', 'drink'] },
        { id: 'c4', items: ['main', 'starter', 'drink'] },
        { id: 'c5', items: ['main', 'drink'] }
    ];

    // SVG Icons (Simplified paths to match the design style)
    const ICONS = {
        soup: `<svg viewBox="0 0 512 512"><path d="M48 208c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v32c0 88.4-71.6 160-160 160H208c-88.4 0-160-71.6-160-160V208zm-16-64h448c8.8 0 16 7.2 16 16v16c0 17.7-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V160c0-8.8 7.2-16 16-16zM152 48h32c8.8 0 16 7.2 16 16v48h-64V64c0-8.8 7.2-16 16-16zm128 0h32c8.8 0 16 7.2 16 16v48h-64V64c0-8.8 7.2-16 16-16zm128 0h32c8.8 0 16 7.2 16 16v48h-64V64c0-8.8 7.2-16 16-16z"/></svg>`,
        main: `<svg viewBox="0 0 512 512"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM216 168c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm-64 48c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zm48-80c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm120 128c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zm-24-72c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24z"/></svg>`,
        starter: `<svg viewBox="0 0 512 512"><path d="M346.7 6C354.3 1.7 363.8 2 371.1 6.8L435.1 49.5C442.2 54.2 446.1 62.6 445.4 71.1L439.4 143.1C469.7 167.3 490.8 202.6 495.2 242.4L510.3 378.8C511.5 389.5 506.7 400 497.6 405.2L421.6 448.7C412.5 453.9 401.1 453.1 392.8 446.7L323.5 393.3C315.2 386.9 310.8 376.6 312 366.1L327.1 229.7C331.5 190 352.6 154.7 382.9 130.5L346.7 6ZM325 210.8C321.4 243.3 304.5 272.1 279.7 292L235.3 327.8C222.8 337.8 205.1 336.7 193.9 325.4L110.1 241.6C98.8 230.3 97.7 212.6 107.8 200.1L143.6 155.7C163.4 130.9 192.3 114 224.7 110.4L325 210.8zM192.8 106.8C162.9 110.2 136.2 125.8 118 148.6L82.2 193C62.1 218 64.3 253.5 86.9 276.1L170.7 359.9C193.3 382.5 228.8 384.7 253.8 364.6L298.2 328.8C321 310.6 336.6 283.9 340 254L192.8 106.8z"/></svg>`,
        drink: `<svg viewBox="0 0 512 512"><path d="M88 0C74.7 0 64 10.7 64 24c0 38.9 23.4 72.4 56.5 87.7l-26 148.3c-2.4 13.8 6.9 27 20.7 29.5s27-6.9 29.5-20.7l26.2-149.3c5.3-30.2 31.5-52.6 62.2-52.6H272c8.8 0 16-7.2 16-16s-7.2-16-16-16H233.1C230.6 15.6 213.9 0 194.2 0H88zM32 304c0-26.5 21.5-48 48-48H368c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V304zM240 360c0-8.8-7.2-16-16-16H160c-8.8 0-16 7.2-16 16s7.2 16 16 16h64c8.8 0 16-7.2 16-16z"/></svg>`,
        dessert: `<svg viewBox="0 0 512 512"><path d="M160 32c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V64h48c26.5 0 48 21.5 48 48V256h48c17.7 0 32 14.3 32 32v32c0 30.2-20.9 55.4-49.1 62.3l-18.7 82c-1.7 7.4-8.3 12.8-15.9 12.8H162.7c-7.6 0-14.2-5.3-15.9-12.8l-18.7-82C99.8 343.4 78.9 318.2 78.9 288V256c0-17.7 14.3-32 32-32h48V32zM320 256H192v32c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V256z"/></svg>`
    };

    const LABELS = {
        soup: 'Суп',
        main: 'Главное блюдо',
        starter: 'Салат',
        drink: 'Напиток',
        dessert: 'Десерт'
    };

    // --- RENDER VISUALS ---
    function initComboVisuals() {
        const container = document.getElementById('combo-display');
        const dessertContainer = document.getElementById('dessert-icon-status');

        if (!container) return;
        container.innerHTML = ''; // Clear

        // 1. Render Main Combos
        COMBOS.forEach(combo => {
            const comboEl = document.createElement('div');
            comboEl.className = 'combo-option';
            comboEl.id = `combo-${combo.id}`;
            
            combo.items.forEach(cat => {
                const itemEl = document.createElement('div');
                itemEl.className = 'combo-item-visual';
                itemEl.dataset.category = cat; // For highlighting logic
                
                itemEl.innerHTML = `
                    <div class="combo-svg-box">${ICONS[cat]}</div>
                    <span class="combo-label">${LABELS[cat]}</span>
                `;
                comboEl.appendChild(itemEl);
            });

            container.appendChild(comboEl);
        });

        // 2. Render Dessert Icon
        if (dessertContainer) {
            dessertContainer.innerHTML = ICONS['dessert'];
            dessertContainer.className = 'combo-svg-box';
        }
    }

    // --- CORE LOGIC ---

    function saveOrder() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedDishes));
    }

    function loadOrder() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const savedData = JSON.parse(raw);
                Object.entries(savedData).forEach(([cat, keyword]) => {
                    const dish = window.dishes.find(d => d.keyword === keyword);
                    if (dish) selectedDishes[cat] = keyword;
                });
            } catch (e) { console.error(e); }
        }
        updateUI();
    }

    function updateUI() {
        // 1. Update Cards (Border & Button)
        document.querySelectorAll('.food-card').forEach(card => {
            const btn = card.querySelector('button');
            const keyword = card.dataset.dish;
            const isSelected = Object.values(selectedDishes).includes(keyword);

            if (isSelected) {
                card.classList.add('selected');
                card.style.border = "2px solid #e67e22"; // Match icon color
                if (btn) {
                    btn.textContent = 'Убрать';
                    btn.style.background = '#e74c3c';
                    btn.style.color = 'white';
                }
            } else {
                card.classList.remove('selected');
                card.style.border = "";
                if (btn) {
                    btn.textContent = 'Добавить';
                    btn.style.background = '';
                    btn.style.color = '';
                }
            }
        });

        // 2. Update Footer Panel (Total Price)
        let total = 0;
        const currentCats = Object.keys(selectedDishes);
        
        currentCats.forEach(cat => {
            const keyword = selectedDishes[cat];
            const dish = window.dishes.find(d => d.keyword === keyword);
            if (dish) total += dish.price;
        });

        const orderPanel = document.getElementById('order-panel');
        const totalPriceEl = document.getElementById('total-price-panel');
        
        if (orderPanel) {
            orderPanel.style.display = currentCats.length > 0 ? 'block' : 'none';
            if (totalPriceEl) totalPriceEl.textContent = total;
        }

        // 3. UPDATE COMBO VISUALS (The key task)
        updateComboStatus(currentCats);

        // 4. Update "Order" Button State
        const orderLink = document.getElementById('order-link');
        const isComboValid = checkComboValidity(currentCats);

        if (orderLink) {
            if (isComboValid) {
                orderLink.classList.remove('disabled');
                orderLink.textContent = 'Оформить заказ';
                orderLink.href = 'order.html';
                orderLink.style.pointerEvents = 'auto';
                orderLink.style.background = '#4a90e2';
            } else {
                orderLink.classList.add('disabled');
                orderLink.textContent = 'Соберите комбо';
                orderLink.href = '#';
                orderLink.style.pointerEvents = 'none';
                orderLink.style.background = '#ccc';
            }
        }
    }

    function updateComboStatus(selectedCategories) {
        // Reset all visuals first
        document.querySelectorAll('.combo-option').forEach(el => el.classList.remove('valid-combo'));
        document.querySelectorAll('.combo-item-visual').forEach(el => el.classList.remove('selected'));

        // Highlight items inside combos
        selectedCategories.forEach(cat => {
            // Find all icons representing this category
            const icons = document.querySelectorAll(`.combo-item-visual[data-category="${cat}"]`);
            icons.forEach(icon => icon.classList.add('selected'));
        });

        // Highlight Dessert if selected
        const dessertIcon = document.getElementById('dessert-icon-status');
        if (dessertIcon && selectedCategories.includes('dessert')) {
            dessertIcon.querySelector('svg').style.fill = '#e67e22';
        } else if (dessertIcon) {
            dessertIcon.querySelector('svg').style.fill = '#ccc';
        }

        // Highlight Completed Combos
        COMBOS.forEach(combo => {
            // Check if every item in this combo is present in selectedCategories
            const isComplete = combo.items.every(item => selectedCategories.includes(item));
            
            if (isComplete) {
                const comboEl = document.getElementById(`combo-${combo.id}`);
                if (comboEl) comboEl.classList.add('valid-combo');
            }
        });
    }

    function checkComboValidity(selectedCategories) {
        // Check if ANY of the predefined combos are satisfied
        // Dessert is optional, so we filter it out for the check
        const basicCats = selectedCategories.filter(c => c !== 'dessert');
        
        return COMBOS.some(combo => {
            // Does the user have ALL items required for this combo?
            // Note: Use 'combo.items' vs 'selectedCategories'
            // We check if every required item is in the user's selection
            return combo.items.every(req => selectedCategories.includes(req));
        });
    }

    // --- EVENTS ---

    document.addEventListener('click', (event) => {
        const btn = event.target.closest('button');
        if (!btn) return;
        
        const card = btn.closest('.food-card');
        if (!card || !card.dataset.dish) return;

        event.preventDefault();

        const keyword = card.dataset.dish;
        const dishObj = window.dishes.find(d => d.keyword === keyword);
        if (!dishObj) return;

        const cat = CATEGORY_MAP[dishObj.category];
        
        if (selectedDishes[cat] === keyword) {
            delete selectedDishes[cat]; // Deselect
        } else {
            selectedDishes[cat] = keyword; // Select/Switch
        }

        saveOrder();
        updateUI();
    });

    // --- INIT ---
    // Wait for dishes to load, then render
    const initInterval = setInterval(() => {
        if (window.dishes && window.dishes.length > 0) {
            clearInterval(initInterval);
            initComboVisuals(); // Draw icons
            loadOrder();        // Restore state
        }
    }, 200);

})();
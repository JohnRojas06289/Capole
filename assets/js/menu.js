/**
 * Capoleto Café - Menu Page JavaScript
 * This file contains functionality specific to the menu page
 */

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu category filtering
    initMenuFilters();
    
    // Set URL parameters for menu filtering if present
    checkURLParameters();
});

/**
 * Initialize menu category filtering
 */
function initMenuFilters() {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItems = document.querySelectorAll('[data-category]');
    
    if (!menuTabs.length || !menuItems.length) return;
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            
            // Filter products based on category
            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Check URL parameters and filter menu accordingly
 */
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        const categoryTab = document.querySelector(`.menu-tab[data-category="${category}"]`);
        
        if (categoryTab) {
            categoryTab.click();
        }
    }
}

/**
 * Initialize quick view modal functionality
 */
function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.menu-quick-view');
    const modal = document.querySelector('.menu-modal');
    
    if (!quickViewButtons.length || !modal) return;
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productId = button.getAttribute('data-id');
            
            // Here you would normally fetch product details from an API
            // For this example, we'll simulate it with a timeout
            
            // Show loading state
            modal.querySelector('.menu-modal-details').innerHTML = '<p>Cargando...</p>';
            modal.classList.add('active');
            
            setTimeout(() => {
                // Load product details (this would come from API)
                loadProductDetails(productId, modal);
            }, 500);
        });
    });
    
    // Close modal when clicking the close button
    const closeButton = modal.querySelector('.menu-modal-close');
    
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

/**
 * Load product details into the quick view modal
 * @param {string} productId - The ID of the product to load
 * @param {HTMLElement} modal - The modal element
 */
function loadProductDetails(productId, modal) {
    // In a real application, you would fetch data from an API
    // Here we're using static content for demonstration
    
    const productData = {
        title: 'Croissant de Chocolate',
        description: 'Delicioso croissant con líneas de chocolate belga, horneado a la perfección para conseguir una textura crujiente por fuera y suave por dentro.',
        price: '$3.50',
        image: 'assets/images/products/pastry1.jpg',
        options: [
            {
                title: 'Tamaño',
                choices: ['Regular', 'Grande (+$0.50)']
            },
            {
                title: 'Temperatura',
                choices: ['Temperatura ambiente', 'Caliente (+$0.25)']
            }
        ]
    };
    
    // Build modal content
    let modalContent = `
        <h2 class="menu-modal-title">${productData.title}</h2>
        <p class="menu-modal-description">${productData.description}</p>
        <div class="menu-modal-price">${productData.price}</div>
        
        <div class="menu-modal-options">
    `;
    
    // Add options
    productData.options.forEach(optionGroup => {
        modalContent += `
            <div class="menu-modal-option-group">
                <div class="menu-modal-option-title">${optionGroup.title}</div>
        `;
        
        optionGroup.choices.forEach((choice, index) => {
            modalContent += `
                <div class="menu-modal-option">
                    <input type="radio" id="option-${optionGroup.title.toLowerCase()}-${index}" 
                        name="option-${optionGroup.title.toLowerCase()}" 
                        ${index === 0 ? 'checked' : ''}>
                    <label for="option-${optionGroup.title.toLowerCase()}-${index}">${choice}</label>
                </div>
            `;
        });
        
        modalContent += `</div>`;
    });
    
    modalContent += `</div>
        
        <div class="menu-modal-quantity">
            <span>Cantidad:</span>
            <div class="quantity-control">
                <button class="quantity-btn minus">-</button>
                <input type="number" class="quantity-input" value="1" min="1" max="10">
                <button class="quantity-btn plus">+</button>
            </div>
        </div>
        
        <div class="menu-modal-actions">
            <button class="btn btn-primary">Agregar al pedido</button>
            <a href="order.html?product=${productId}" class="btn btn-outline">Comprar ahora</a>
        </div>
    `;
    
    // Update image
    modal.querySelector('.menu-modal-image img').src = productData.image;
    
    // Update content
    modal.querySelector('.menu-modal-details').innerHTML = modalContent;
    
    // Setup quantity controls
    const quantityInput = modal.querySelector('.quantity-input');
    const minusBtn = modal.querySelector('.quantity-btn.minus');
    const plusBtn = modal.querySelector('.quantity-btn.plus');
    
    minusBtn.addEventListener('click', () => {
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        if (parseInt(quantityInput.value) < 10) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
    });
}

/**
 * Initialize grid/list view toggle functionality
 */
function initViewToggle() {
    const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
    const listBtn = document.querySelector('.view-btn[data-view="list"]');
    const productsGrid = document.querySelector('.products-grid');
    
    if (!gridBtn || !listBtn || !productsGrid) return;
    
    gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        productsGrid.classList.remove('menu-list-view');
        productsGrid.classList.add('menu-grid-view');
        
        // Save preference to localStorage
        localStorage.setItem('menuView', 'grid');
    });
    
    listBtn.addEventListener('click', () => {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        productsGrid.classList.remove('menu-grid-view');
        productsGrid.classList.add('menu-list-view');
        
        // Save preference to localStorage
        localStorage.setItem('menuView', 'list');
    });
    
    // Check for saved preference
    const savedView = localStorage.getItem('menuView');
    
    if (savedView === 'list') {
        listBtn.click();
    } else {
        gridBtn.click();
    }
}
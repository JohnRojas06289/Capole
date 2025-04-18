/**
 * Capoleto Café - Menu Page JavaScript
 * This file contains functionality specific to the menu page
 */

// Product data will be loaded here
let productData = [];

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products data
    loadProductData();
    
    // Initialize menu category tab filtering
    initCategoryTabs();
    
    // Initialize quick view functionality when products are loaded
    setTimeout(() => {
        initQuickView();
    }, 1000);
    
    // Initialize search functionality
    initSearchFilter();
    
    // Initialize view toggle (grid/list)
    initViewToggle();
});

/**
 * Load products data from JSON file
 */
function loadProductData() {
    fetch('assets/data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            productData = data;
            displayAllProducts(data.products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            document.querySelector('#menu-grid').innerHTML = `
                <div class="error-message">
                    <p>Lo sentimos, ha ocurrido un error al cargar los productos.</p>
                    <p>Por favor, intenta recargar la página.</p>
                </div>
            `;
        });
}

/**
 * Display all products in the menu
 * @param {Array} products - The products to display
 */
function displayAllProducts(products) {
    const menuGrid = document.querySelector('#menu-grid');
    
    // Clear any loading spinner
    menuGrid.innerHTML = '';
    
    // Display products
    products.forEach(product => {
        const formattedPrice = product.price.toLocaleString('es-CO', {
            style: 'currency',
            currency: product.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        const tagsHtml = product.tags ? product.tags.map(tag => 
            `<span class="menu-item-tag${tag === 'caliente' || tag === 'popular' ? ' special-tag' : ''}">${tag}</span>`
        ).join('') : '';
        
        const productCard = `
            <div class="product-card menu-item-card" data-category="${product.category}" data-id="${product.id}" data-name="${product.name.toLowerCase()}" data-price="${product.price}">
                <div class="product-image menu-item-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.bestseller ? '<div class="product-badge">Bestseller</div>' : ''}
                    <button class="menu-quick-view" data-id="${product.id}">Vista rápida</button>
                </div>
                <div class="product-info menu-item-info">
                    <h3 class="menu-item-name">${product.name}</h3>
                    <span class="menu-item-price">${formattedPrice}</span>
                    <p class="menu-item-description">${product.description}</p>
                    <div class="menu-item-tags">
                        ${tagsHtml}
                    </div>
                    <div class="menu-item-action" style="margin-top: 15px;">
                        <a href="order.html?product=${product.id}" class="btn btn-primary btn-sm btn-rounded">Ordenar</a>
                    </div>
                </div>
            </div>
        `;
        
        menuGrid.innerHTML += productCard;
    });
}

/**
 * Initialize category tabs filtering
 */
function initCategoryTabs() {
    const menuTabs = document.querySelectorAll('.menu-tab');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Filter products by category
            const category = tab.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
}

/**
 * Filter products based on selected category
 * @param {string} category - The category to filter by
 */
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Initialize search filter functionality
 */
function initSearchFilter() {
    const searchInput = document.getElementById('menu-search-input');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterProductsBySearch(searchTerm);
    });
}

/**
 * Filter products based on search term
 * @param {string} searchTerm - The search term to filter by
 */
function filterProductsBySearch(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    
    if (searchTerm === '') {
        // If search is empty, respect category filtering
        const activeCategory = document.querySelector('.menu-tab.active').getAttribute('data-category');
        filterProductsByCategory(activeCategory);
        return;
    }
    
    productCards.forEach(card => {
        const productName = card.getAttribute('data-name');
        const activeCategory = document.querySelector('.menu-tab.active').getAttribute('data-category');
        
        // Match by name and respect active category
        if (productName.includes(searchTerm) && (activeCategory === 'all' || card.getAttribute('data-category') === activeCategory)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Initialize grid/list view toggle
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

/**
 * Initialize quick view modal functionality
 */
function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.menu-quick-view');
    const modal = document.querySelector('#product-modal');
    
    if (!quickViewButtons.length || !modal) return;
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = button.getAttribute('data-id');
            
            // Find product data
            const product = findProductById(productId);
            
            if (product) {
                loadProductIntoModal(product, modal);
                modal.classList.add('active');
            }
        });
    });
    
    // Close modal when clicking the close button
    const closeButton = modal.querySelector('#modal-close');
    
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
 * Find product by its ID
 * @param {string} productId - The ID of the product to find
 * @returns {Object|null} - The product object or null if not found
 */
function findProductById(productId) {
    if (!productData.products) return null;
    
    return productData.products.find(product => product.id === productId) || null;
}

/**
 * Load product details into the quick view modal
 * @param {Object} product - The product to display in the modal
 * @param {HTMLElement} modal - The modal element
 */
function loadProductIntoModal(product, modal) {
    const formattedPrice = product.price.toLocaleString('es-CO', {
        style: 'currency',
        currency: product.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    // Set modal image
    const modalImage = modal.querySelector('.menu-modal-image img');
    if (modalImage) {
        modalImage.src = product.image;
        modalImage.alt = product.name;
    }
    
    // Set modal details
    const modalDetails = modal.querySelector('.menu-modal-details');
    if (modalDetails) {
        const tagsHtml = product.tags ? product.tags.map(tag => 
            `<span class="menu-item-tag${tag === 'caliente' || tag === 'popular' ? ' special-tag' : ''}">${tag}</span>`
        ).join('') : '';
        
        modalDetails.innerHTML = `
            <h2 class="menu-modal-title">${product.name}</h2>
            <p class="menu-modal-description">${product.description}</p>
            <div class="menu-modal-price">${formattedPrice}</div>
            
            <div class="menu-item-tags" style="margin: 15px 0;">
                ${tagsHtml}
            </div>
            
            <div class="menu-modal-quantity">
                <span>Cantidad:</span>
                <div class="quantity-control">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="10">
                    <button class="quantity-btn plus">+</button>
                </div>
            </div>
            
            <div class="menu-modal-actions" style="margin-top: 20px;">
                <a href="order.html?product=${product.id}" class="btn btn-primary btn-rounded">Ordenar ahora</a>
                <button class="btn btn-outline btn-rounded add-to-cart" data-id="${product.id}">Agregar al carrito</button>
            </div>
        `;
        
        // Setup quantity controls
        const quantityInput = modalDetails.querySelector('.quantity-input');
        const minusBtn = modalDetails.querySelector('.quantity-btn.minus');
        const plusBtn = modalDetails.querySelector('.quantity-btn.plus');
        
        if (minusBtn && plusBtn && quantityInput) {
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
        
        // Setup add to cart button
        const addToCartBtn = modalDetails.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                addToCart(product, quantity);
                modal.classList.remove('active');
                
                // Show notification
                showNotification(`${quantity} ${product.name} añadido al carrito`);
            });
        }
    }
}

/**
 * Add product to cart
 * @param {Object} product - The product to add
 * @param {number} quantity - The quantity to add
 */
function addToCart(product, quantity) {
    // This is a placeholder function
    // In a real application, you would implement cart functionality
    console.log(`Added ${quantity} of ${product.name} to cart`);
    
    // For demonstration purposes, we'll redirect to the order page
    window.location.href = `order.html?product=${product.id}&quantity=${quantity}`;
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The notification type ('success' or 'error')
 */
function showNotification(message, type = 'success') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles to the notification container
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles to the notification
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#F44336';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '10px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 3px 6px rgba(0,0,0,0.2)';
    notification.style.minWidth = '200px';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Trigger reflow to start transition
    notification.offsetHeight;
    notification.style.opacity = '1';
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
            
            // Remove container if empty
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 300); // Wait for fade out transition
    }, 3000);
}
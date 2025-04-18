/**
 * Capoleto Café - Main JavaScript File
 * Updated version with product loading from JSON
 */

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the mobile menu toggle
    initMobileMenu();
    
    // Initialize sticky header
    initStickyHeader();
    
    // Initialize FAQ accordion if it exists on the page
    if (document.querySelector('.faq-item')) {
        initFaqAccordion();
    }
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize the newsletter form submission if it exists
    if (document.querySelector('.newsletter-form')) {
        initNewsletterForm();
    }
    
    // Initialize contact form submission if it exists
    if (document.querySelector('#contact-form')) {
        initContactForm();
    }

    // Load products from JSON if product containers exist
    if (document.querySelector('.coffee-cards') || 
        document.querySelector('.products-grid') || 
        document.querySelector('.menu-products')) {
        loadProducts();
    }
});

/**
 * Load products from JSON file
 */
function loadProducts() {
    fetch('assets/data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process product data based on page
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                displayFeaturedProducts(data);
            } else if (window.location.pathname.includes('menu.html')) {
                displayMenuProducts(data);
            } else if (window.location.pathname.includes('order.html')) {
                setupOrderProducts(data);
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

/**
 * Display featured products on the homepage
 * @param {Object} data - The product data from JSON
 */
function displayFeaturedProducts(data) {
    // Update coffee section
    const coffeeContainer = document.querySelector('.coffee-cards');
    if (coffeeContainer) {
        // Filter coffee products
        const coffeeProducts = data.products.filter(product => product.category === 'cafe');
        
        // Clear container
        coffeeContainer.innerHTML = '';
        
        // Add up to 3 coffee products
        coffeeProducts.slice(0, 3).forEach(product => {
            const formattedPrice = product.price.toLocaleString('es-CO', {
                style: 'currency',
                currency: product.currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            
            const productHtml = `
                <div class="coffee-card">
                    <div class="coffee-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="coffee-info">
                        <div class="coffee-name">${product.name}</div>
                        <span class="coffee-price">${formattedPrice}</span>
                        <p class="coffee-description">${product.description}</p>
                        <div class="coffee-action">
                            <a href="order.html?product=${product.id}" class="btn btn-primary btn-sm btn-rounded">Delivery</a>
                        </div>
                    </div>
                </div>
            `;
            
            coffeeContainer.innerHTML += productHtml;
        });
    }
    
    // Update featured products if they exist
    const featuredContainer = document.querySelector('.products-grid');
    if (featuredContainer) {
        // Filter bestseller products
        const featuredProducts = data.products.filter(product => product.bestseller);
        
        // Clear container
        featuredContainer.innerHTML = '';
        
        // Add featured products
        featuredProducts.slice(0, 4).forEach(product => {
            const formattedPrice = product.price.toLocaleString('es-CO', {
                style: 'currency',
                currency: product.currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            
            const productHtml = `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.bestseller ? '<div class="product-badge">Bestseller</div>' : ''}
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="product-price">
                            ${formattedPrice}
                        </div>
                        <a href="order.html?product=${product.id}" class="btn btn-primary btn-sm btn-rounded">Ordenar</a>
                    </div>
                </div>
            `;
            
            featuredContainer.innerHTML += productHtml;
        });
    }
}

/**
 * Display all products on the menu page
 * @param {Object} data - The product data from JSON
 */
function displayMenuProducts(data) {
    const menuContainer = document.querySelector('#menu-grid');
    if (!menuContainer) return;
    
    // Clear container
    menuContainer.innerHTML = '';
    
    // Display all products
    data.products.forEach(product => {
        const formattedPrice = product.price.toLocaleString('es-CO', {
            style: 'currency',
            currency: product.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        const productHtml = `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.bestseller ? '<div class="product-badge">Bestseller</div>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">
                        ${formattedPrice}
                    </div>
                    <a href="order.html?product=${product.id}" class="btn btn-primary btn-sm btn-rounded">Ordenar</a>
                </div>
            </div>
        `;
        
        menuContainer.innerHTML += productHtml;
    });
    
    // Reinitialize menu filters
    if (typeof initMenuFilters === 'function') {
        initMenuFilters();
    }
}

/**
 * Setup products for the order page
 * @param {Object} data - The product data from JSON
 */
function setupOrderProducts(data) {
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;
    
    // Clear container
    orderItemsContainer.innerHTML = '';
    
    // Display all products
    data.products.forEach(product => {
        const formattedPrice = product.price.toLocaleString('es-CO', {
            style: 'currency',
            currency: product.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        const productHtml = `
            <div class="order-item" data-category="${product.category}">
                <div class="item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="item-details">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="item-price">${formattedPrice}</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" data-id="${product.id}">-</button>
                    <input type="number" value="0" min="0" max="10" data-id="${product.id}" data-price="${product.price}" data-name="${product.name}">
                    <button class="quantity-btn plus" data-id="${product.id}">+</button>
                </div>
            </div>
        `;
        
        orderItemsContainer.innerHTML += productHtml;
    });
    
    // Reinitialize order functionality
    if (typeof initQuantityHandlers === 'function') {
        initQuantityHandlers();
    }
    
    if (typeof initCategoryFilters === 'function') {
        initCategoryFilters();
    }
    
    // Check for URL parameters
    if (typeof checkURLParameters === 'function') {
        checkURLParameters();
    }
}

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // Toggle menu icon animation
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.main-nav') && !event.target.closest('#menu-toggle') && mainNav.classList.contains('active')) {
            menuToggle.click();
        }
    });
    
    // Close mobile menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
            menuToggle.click();
        }
    });
}

/**
 * Initialize sticky header functionality
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const faqAnswer = faqItem.querySelector('.faq-answer');
                faqAnswer.style.display = 'none';
            });
            
            // If the clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                answer.style.display = 'block';
            }
        });
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Initialize newsletter form submission
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }
        
        // Simulate form submission (in a real project, this would be an API call)
        setTimeout(() => {
            showNotification('¡Gracias por suscribirte a nuestro newsletter!', 'success');
            emailInput.value = '';
        }, 1000);
    });
}

/**
 * Initialize contact form submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate form fields
        if (name === '') {
            showNotification('Por favor, ingresa tu nombre.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }
        
        if (message === '') {
            showNotification('Por favor, ingresa un mensaje.', 'error');
            return;
        }
        
        // Simulate form submission (in a real project, this would be an API call)
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        setTimeout(() => {
            showNotification('¡Gracias por tu mensaje! Te responderemos lo antes posible.', 'success');
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar mensaje';
        }, 1500);
    });
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
            
            // Remove container if empty
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 300); // Wait for fade out transition
    }, 5000);
}
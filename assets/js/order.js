/**
 * Capoleto Café - Order Page JavaScript
 * This file contains functionality specific to the order page
 */

// Global variables to track order state
let orderItems = [];
let subtotal = 0;
let deliveryFee = 2.50;
let isDelivery = false;

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize order steps
    initOrderSteps();
    
    // Initialize product category filters
    initCategoryFilters();
    
    // Initialize product quantity handlers
    initQuantityHandlers();
    
    // Initialize delivery method selection
    initDeliveryMethodSelection();
    
    // Check URL for pre-selected products
    checkURLParameters();
});

/**
 * Initialize order steps navigation
 */
function initOrderSteps() {
    const continueBtn = document.getElementById('continue-btn');
    const backToStep1Btn = document.getElementById('back-to-step-1');
    const continueToStep3Btn = document.getElementById('continue-to-step-3');
    const backToStep2Btn = document.getElementById('back-to-step-2');
    const sendOrderBtn = document.getElementById('send-order');
    
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    const orderStep1 = document.getElementById('order-step-1');
    const orderStep2 = document.getElementById('order-step-2');
    const orderStep3 = document.getElementById('order-step-3');
    
    if (!continueBtn || !orderStep1) return;
    
    // Continue to Step 2
    continueBtn.addEventListener('click', () => {
        orderStep1.classList.add('hidden');
        orderStep2.classList.remove('hidden');
        
        step1.classList.remove('active');
        step2.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update order summary in step 2
        updateOrderSummaryStep2();
    });
    
    // Back to Step 1
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => {
            orderStep2.classList.add('hidden');
            orderStep1.classList.remove('hidden');
            
            step2.classList.remove('active');
            step1.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Continue to Step 3
    if (continueToStep3Btn) {
        continueToStep3Btn.addEventListener('click', () => {
            // Validate delivery form
            if (!validateDeliveryForm()) {
                return;
            }
            
            orderStep2.classList.add('hidden');
            orderStep3.classList.remove('hidden');
            
            step2.classList.remove('active');
            step3.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Update order confirmation in step 3
            updateOrderConfirmation();
        });
    }
    
    // Back to Step 2
    if (backToStep2Btn) {
        backToStep2Btn.addEventListener('click', () => {
            orderStep3.classList.add('hidden');
            orderStep2.classList.remove('hidden');
            
            step3.classList.remove('active');
            step2.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Send Order via WhatsApp
    if (sendOrderBtn) {
        sendOrderBtn.addEventListener('click', () => {
            sendOrderViaWhatsApp();
        });
    }
}

/**
 * Initialize category filters for order items
 */
function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const orderItems = document.querySelectorAll('.order-item');
    
    if (!categoryButtons.length || !orderItems.length) return;
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            // Filter products based on category
            orderItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'grid';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Initialize quantity handlers for products
 */
function initQuantityHandlers() {
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    const quantityInputs = document.querySelectorAll('.item-quantity input');
    
    if (!minusButtons.length || !plusButtons.length || !quantityInputs.length) return;
    
    // Handle minus buttons
    minusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const input = document.querySelector(`input[data-id="${productId}"]`);
            
            if (parseInt(input.value) > 0) {
                input.value = parseInt(input.value) - 1;
                updateOrderSummary();
            }
        });
    });
    
    // Handle plus buttons
    plusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const input = document.querySelector(`input[data-id="${productId}"]`);
            
            if (parseInt(input.value) < 10) {
                input.value = parseInt(input.value) + 1;
                updateOrderSummary();
            }
        });
    });
    
    // Handle direct input changes
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            // Ensure value is within range
            if (parseInt(input.value) < 0) {
                input.value = 0;
            } else if (parseInt(input.value) > 10) {
                input.value = 10;
            }
            
            updateOrderSummary();
        });
    });
}

/**
 * Update the order summary based on selected products
 */
function updateOrderSummary() {
    const quantityInputs = document.querySelectorAll('.item-quantity input');
    const orderList = document.getElementById('order-list');
    const orderTotal = document.getElementById('order-total');
    const continueBtn = document.getElementById('continue-btn');
    
    if (!orderList || !orderTotal || !continueBtn) return;
    
    // Reset orderItems and subtotal
    orderItems = [];
    subtotal = 0;
    
    // Collect items with quantity > 0
    quantityInputs.forEach(input => {
        const quantity = parseInt(input.value);
        
        if (quantity > 0) {
            const productId = input.getAttribute('data-id');
            const productName = input.getAttribute('data-name');
            const productPrice = parseFloat(input.getAttribute('data-price'));
            
            orderItems.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: quantity,
                total: productPrice * quantity
            });
            
            subtotal += productPrice * quantity;
        }
    });
    
    // Update order list
    if (orderItems.length > 0) {
        let listHTML = '';
        
        orderItems.forEach(item => {
            listHTML += `
                <div class="order-item-row">
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <div class="order-item-total">$${item.total.toFixed(2)}</div>
                </div>
            `;
        });
        
        orderList.innerHTML = listHTML;
        orderTotal.textContent = `$${subtotal.toFixed(2)}`;
        continueBtn.disabled = false;
    } else {
        orderList.innerHTML = '<p class="empty-cart">No has seleccionado productos aún</p>';
        orderTotal.textContent = '$0.00';
        continueBtn.disabled = true;
    }
}

/**
 * Initialize delivery method selection
 */
function initDeliveryMethodSelection() {
    const deliveryRadios = document.querySelectorAll('input[name="delivery-method"]');
    const addressFields = document.getElementById('address-fields');
    
    if (!deliveryRadios.length || !addressFields) return;
    
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'delivery') {
                addressFields.classList.remove('hidden');
                isDelivery = true;
            } else {
                addressFields.classList.add('hidden');
                isDelivery = false;
            }
            
            // Update totals to reflect delivery choice
            updateOrderSummaryStep2();
        });
    });
}

/**
 * Update the order summary in step 2
 */
function updateOrderSummaryStep2() {
    const orderListStep2 = document.getElementById('order-list-step-2');
    const subtotalEl = document.getElementById('subtotal');
    const totalStep2 = document.getElementById('total-step-2');
    const deliveryFeeContainer = document.getElementById('delivery-fee-container');
    
    if (!orderListStep2 || !subtotalEl || !totalStep2 || !deliveryFeeContainer) return;
    
    // Show delivery fee if delivery method is selected
    if (isDelivery) {
        deliveryFeeContainer.classList.remove('hidden');
        totalStep2.textContent = `$${(subtotal + deliveryFee).toFixed(2)}`;
    } else {
        deliveryFeeContainer.classList.add('hidden');
        totalStep2.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update subtotal
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    // Update order list
    if (orderItems.length > 0) {
        let listHTML = '';
        
        orderItems.forEach(item => {
            listHTML += `
                <div class="order-item-row">
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <div class="order-item-total">$${item.total.toFixed(2)}</div>
                </div>
            `;
        });
        
        orderListStep2.innerHTML = listHTML;
    } else {
        orderListStep2.innerHTML = '<p class="empty-cart">No has seleccionado productos aún</p>';
    }
}

/**
 * Validate the delivery form
 * @returns {boolean} Whether the form is valid
 */
function validateDeliveryForm() {
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const zipcode = document.getElementById('zipcode');
    
    let isValid = true;
    
    // Validate required fields
    if (!name.value.trim()) {
        highlightInvalidField(name, 'Por favor ingresa tu nombre');
        isValid = false;
    } else {
        resetField(name);
    }
    
    if (!phone.value.trim()) {
        highlightInvalidField(phone, 'Por favor ingresa tu teléfono');
        isValid = false;
    } else {
        resetField(phone);
    }
    
    if (!email.value.trim()) {
        highlightInvalidField(email, 'Por favor ingresa tu email');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        highlightInvalidField(email, 'Por favor ingresa un email válido');
        isValid = false;
    } else {
        resetField(email);
    }
    
    // Validate address fields if delivery is selected
    if (isDelivery) {
        if (!address.value.trim()) {
            highlightInvalidField(address, 'Por favor ingresa tu dirección');
            isValid = false;
        } else {
            resetField(address);
        }
        
        if (!city.value.trim()) {
            highlightInvalidField(city, 'Por favor ingresa tu ciudad');
            isValid = false;
        } else {
            resetField(city);
        }
        
        if (!zipcode.value.trim()) {
            highlightInvalidField(zipcode, 'Por favor ingresa tu código postal');
            isValid = false;
        } else {
            resetField(zipcode);
        }
    }
    
    return isValid;
}

/**
 * Highlight an invalid form field
 * @param {HTMLElement} field - The field to highlight
 * @param {string} message - The error message
 */
function highlightInvalidField(field, message) {
    field.style.borderColor = 'red';
    
    // Create error message if it doesn't exist
    let errorElement = field.parentElement.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

/**
 * Reset a form field
 * @param {HTMLElement} field - The field to reset
 */
function resetField(field) {
    field.style.borderColor = '';
    
    // Remove error message if it exists
    const errorElement = field.parentElement.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
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
 * Update the order confirmation in step 3
 */
function updateOrderConfirmation() {
    const orderListStep3 = document.getElementById('order-list-step-3');
    const subtotalStep3 = document.getElementById('subtotal-step-3');
    const totalStep3 = document.getElementById('total-step-3');
    const deliveryFeeContainerStep3 = document.getElementById('delivery-fee-container-step-3');
    const deliveryInfo = document.getElementById('delivery-info');
    
    if (!orderListStep3 || !subtotalStep3 || !totalStep3 || !deliveryFeeContainerStep3 || !deliveryInfo) return;
    
    // Update order items
    if (orderItems.length > 0) {
        let listHTML = '';
        
        orderItems.forEach(item => {
            listHTML += `
                <div class="order-item-row">
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <div class="order-item-total">$${item.total.toFixed(2)}</div>
                </div>
            `;
        });
        
        orderListStep3.innerHTML = listHTML;
    }
    
    // Update totals
    subtotalStep3.textContent = `$${subtotal.toFixed(2)}`;
    
    if (isDelivery) {
        deliveryFeeContainerStep3.classList.remove('hidden');
        totalStep3.textContent = `$${(subtotal + deliveryFee).toFixed(2)}`;
    } else {
        deliveryFeeContainerStep3.classList.add('hidden');
        totalStep3.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update delivery info
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    let deliveryInfoHTML = `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
    `;
    
    if (isDelivery) {
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zipcode = document.getElementById('zipcode').value;
        
        deliveryInfoHTML += `
            <p><strong>Método de entrega:</strong> Entrega a domicilio</p>
            <p><strong>Dirección:</strong> ${address}</p>
            <p><strong>Ciudad:</strong> ${city}</p>
            <p><strong>Código Postal:</strong> ${zipcode}</p>
        `;
    } else {
        deliveryInfoHTML += `
            <p><strong>Método de entrega:</strong> Recoger en tienda</p>
        `;
    }
    
    const notes = document.getElementById('notes').value;
    
    if (notes.trim()) {
        deliveryInfoHTML += `
            <p><strong>Instrucciones especiales:</strong> ${notes}</p>
        `;
    }
    
    deliveryInfo.innerHTML = deliveryInfoHTML;
}

/**
 * Send the order via WhatsApp
 */
function sendOrderViaWhatsApp() {
    // Get customer information
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const notes = document.getElementById('notes').value;
    
    // Format order message
    let message = `*Nuevo Pedido de Capoleto Café*%0A%0A`;
    message += `*Cliente:*%0A`;
    message += `Nombre: ${name}%0A`;
    message += `Teléfono: ${phone}%0A`;
    message += `Email: ${email}%0A%0A`;
    
    if (isDelivery) {
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zipcode = document.getElementById('zipcode').value;
        
        message += `*Método de entrega:* Entrega a domicilio%0A`;
        message += `Dirección: ${address}%0A`;
        message += `Ciudad: ${city}%0A`;
        message += `Código Postal: ${zipcode}%0A%0A`;
    } else {
        message += `*Método de entrega:* Recoger en tienda%0A%0A`;
    }
    
    if (notes.trim()) {
        message += `*Instrucciones especiales:*%0A${notes}%0A%0A`;
    }
    
    message += `*Productos:*%0A`;
    
    orderItems.forEach(item => {
        message += `${item.quantity}x ${item.name} - $${item.total.toFixed(2)}%0A`;
    });
    
    message += `%0A*Subtotal:* $${subtotal.toFixed(2)}%0A`;
    
    if (isDelivery) {
        message += `*Envío:* $${deliveryFee.toFixed(2)}%0A`;
        message += `*Total:* $${(subtotal + deliveryFee).toFixed(2)}%0A`;
    } else {
        message += `*Total:* $${subtotal.toFixed(2)}%0A`;
    }
    
    // Open WhatsApp with the message
    // Replace the phone number with your actual WhatsApp business number
    window.open(`https://wa.me/+573212335821?text=${message}`, '_blank');
}

/**
 * Check URL parameters for pre-selected products
 */
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId) {
        // Find the product input
        const productInput = document.querySelector(`input[data-id="${productId}"]`);
        
        if (productInput) {
            // Set quantity to 1
            productInput.value = 1;
            
            // Update the order summary
            updateOrderSummary();
            
            // Scroll to the product
            productInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}
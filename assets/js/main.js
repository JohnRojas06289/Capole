/**
 * Capoleto Café - Main JavaScript File
 * This file contains common functionality used across the website
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
});

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
    notification.style.borderRadius = '4px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
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
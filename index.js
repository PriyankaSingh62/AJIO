// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.updateCartUI();
        this.bindEvents();
    }

    bindEvents() {
        // Cart icon click
        document.querySelector('.cart-icon').addEventListener('click', () => this.toggleCart());
        document.getElementById('closeCart').addEventListener('click', () => this.toggleCart());
        document.getElementById('cartOverlay').addEventListener('click', () => this.toggleCart());

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e));
        document.querySelector('.search-btn').addEventListener('click', () => this.handleSearchClick());

        // Newsletter form
        document.querySelector('.newsletter-form').addEventListener('submit', (e) => this.handleNewsletter(e));

        // CTA buttons
        document.querySelectorAll('.cta-button').forEach(btn => {
            btn.addEventListener('click', () => this.scrollToProducts());
        });
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }

    addToCart(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.updateCartUI();
        this.saveToStorage();
        this.showNotification('Product added to cart!');
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCartUI();
        this.saveToStorage();
        this.showNotification('Product removed from cart!');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.updateCartUI();
                this.saveToStorage();
            }
        }
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.total;
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.getElementById('cartTotal');
        const cartItems = document.getElementById('cartItems');
        
        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update total
        cartTotal.textContent = this.calculateTotal().toLocaleString();
        
        // Update cart items
        cartItems.innerHTML = '';
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Your cart is empty</p>';
            return;
        }
        
        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div>Qty: ${item.quantity}</div>
                </div>
                <button class="remove-item" onclick="cart.removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    saveToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('shoppingCart');
        if (stored) {
            this.items = JSON.parse(stored);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            const description = product.querySelector('.product-description').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    handleSearchClick() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();
        
        if (query) {
            this.showNotification(`Searching for "${query}"...`);
            // In a real app, this would trigger an API call
        }
    }

    handleNewsletter(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (email) {
            this.showNotification('Thank you for subscribing!');
            e.target.reset();
        }
    }

    scrollToProducts() {
        document.querySelector('.featured-products').scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Product Data
const productsData = [
    {
        id: '1',
        title: 'Premium Cotton T-Shirt',
        description: 'Comfortable and stylish cotton t-shirt perfect for everyday wear',
        price: 899,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
        category: 'men',
        badge: 'New'
    },
    {
        id: '2',
        title: 'Elegant Summer Dress',
        description: 'Beautiful summer dress with floral patterns and comfortable fit',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=300&fit=crop',
        category: 'women',
        badge: 'Trending'
    },
    {
        id: '3',
        title: 'Kids Casual Wear Set',
        description: 'Adorable casual wear set for kids, comfortable and durable',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=300&h=300&fit=crop',
        category: 'kids',
        badge: 'Sale'
    },
    {
        id: '4',
        title: 'Running Shoes',
        description: 'High-performance running shoes with advanced cushioning',
        price: 3999,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
        category: 'footwear',
        badge: 'Popular'
    },
    {
        id: '5',
        title: 'Leather Handbag',
        description: 'Premium leather handbag with multiple compartments',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
        category: 'accessories',
        badge: 'Limited'
    },
    {
        id: '6',
        title: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking capabilities',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        category: 'electronics',
        badge: 'New'
    },
    {
        id: '7',
        title: 'Denim Jacket',
        description: 'Classic denim jacket with modern fit and premium quality',
        price: 2799,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
        category: 'men',
        badge: 'Hot'
    },
    {
        id: '8',
        title: 'Yoga Pants',
        description: 'Comfortable and flexible yoga pants for active lifestyle',
        price: 1599,
        image: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db6?w=300&h=300&fit=crop',
        category: 'women',
        badge: 'Best Seller'
    }
];

// Product Display Functions
class ProductDisplay {
    constructor() {
        this.products = productsData;
        this.init();
    }

    init() {
        this.renderProducts();
        this.bindCategoryFilters();
        this.bindProductInteractions();
    }

    renderProducts(products = this.products) {
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = this.createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <button class="add-to-cart" onclick="cart.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        return card;
    }

    bindCategoryFilters() {
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.querySelector('h3').textContent.toLowerCase().replace("'s", '').replace(' ', '');
                this.filterByCategory(category);
                
                // Update active state
                categoryCards.forEach(c => c.style.opacity = '0.7');
                card.style.opacity = '1';
            });
        });
    }

    filterByCategory(category) {
        let filteredProducts;
        
        if (category === 'electronics') {
            filteredProducts = this.products.filter(p => p.category === 'electronics');
        } else if (category === 'mensclothing') {
            filteredProducts = this.products.filter(p => p.category === 'men');
        } else if (category === 'womensclothing') {
            filteredProducts = this.products.filter(p => p.category === 'women');
        } else if (category === 'kidswear') {
            filteredProducts = this.products.filter(p => p.category === 'kids');
        } else if (category === 'footwear') {
            filteredProducts = this.products.filter(p => p.category === 'footwear');
        } else if (category === 'accessories') {
            filteredProducts = this.products.filter(p => p.category === 'accessories');
        } else {
            filteredProducts = this.products;
        }
        
        this.renderProducts(filteredProducts);
        
        // Scroll to products
        document.querySelector('.featured-products').scrollIntoView({
            behavior: 'smooth'
        });
    }

    bindProductInteractions() {
        // Add hover effects and quick view functionality
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.product-card')) {
                const card = e.target.closest('.product-card');
                card.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.product-card')) {
                const card = e.target.closest('.product-card');
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    }
}

// Navigation and Smooth Scrolling
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.bindNavLinks();
        this.bindScrollEffects();
        this.bindMobileMenu();
    }

    bindNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Scroll to relevant section
                const section = link.textContent.toLowerCase();
                this.scrollToSection(section);
            });
        });
    }

    scrollToSection(section) {
        let targetElement;
        
        switch(section) {
            case 'men':
            case 'women':
            case 'kids':
                targetElement = document.querySelector('.featured-products');
                break;
            case 'indie':
                targetElement = document.querySelector('.categories');
                break;
            case 'home & kitchen':
                targetElement = document.querySelector('.deals-section');
                break;
            case 'electronics':
                targetElement = document.querySelector('.featured-products');
                break;
            default:
                targetElement = document.querySelector('.featured-products');
        }
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    bindScrollEffects() {
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#fff';
                header.style.backdropFilter = 'none';
            }
        });

        // Parallax effect for hero banner
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero-slide img');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    bindMobileMenu() {
        // Mobile menu toggle (for future mobile optimization)
        const userMenu = document.querySelector('.user-menu');
        userMenu.addEventListener('click', () => {
            this.showNotification('Sign in functionality coming soon!');
        });
    }

    showNotification(message) {
        // Reuse cart notification system
        if (window.cart) {
            window.cart.showNotification(message);
        }
    }
}

// Deal Timer and Special Offers
class DealTimer {
    constructor() {
        this.init();
    }

    init() {
        this.startDealTimers();
        this.bindDealInteractions();
    }

    startDealTimers() {
        // Add countdown timers to deal cards
        const dealCards = document.querySelectorAll('.deal-card');
        dealCards.forEach((card, index) => {
            this.addCountdownTimer(card, index);
        });
    }

    addCountdownTimer(card, index) {
        const timerDiv = document.createElement('div');
        timerDiv.className = 'deal-timer';
        timerDiv.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 10px;
            background: rgba(231, 76, 60, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: 600;
        `;
        
        // Set different end times for each deal
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + (index + 1) * 2);
        
        const updateTimer = () => {
            const now = new Date();
            const timeLeft = endTime - now;
            
            if (timeLeft > 0) {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                timerDiv.textContent = `Ends in: ${hours}h ${minutes}m ${seconds}s`;
            } else {
                timerDiv.textContent = 'Deal Expired';
                timerDiv.style.background = 'rgba(127, 140, 141, 0.9)';
            }
        };
        
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
        
        card.appendChild(timerDiv);
    }

    bindDealInteractions() {
        const dealCards = document.querySelectorAll('.deal-card');
        dealCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                window.cart.showNotification(`Viewing deal: ${title}`);
            });
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main components
    window.cart = new ShoppingCart();
    window.productDisplay = new ProductDisplay();
    window.navigation = new Navigation();
    window.dealTimer = new DealTimer();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Show welcome notification
    setTimeout(() => {
        cart.showNotification('Welcome to AJIO Shopping! 🛍️');
    }, 1000);
});

// Additional utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
}

function generateProductId() {
    return 'prod_' + Math.random().toString(36).substr(2, 9);
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ShoppingCart,
        ProductDisplay,
        Navigation,
        DealTimer
    };
}
/**
 * Shopping Cart Implementation using Object Oriented JavaScript (OOJ).
 * * Objective: To demonstrate encapsulation of properties and methods 
 * through Class-based architecture.
 */

// 1. CLASS: Product
// Responsible for storing the immutable properties of a specific item.
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

// 2. CLASS: ShoppingCartItem
// Acts as an intermediary class to link a Product with a quantity.
// This supports the Single Responsibility Principle by keeping the Product class pure.
class ShoppingCartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    // Method to calculate total price for this specific line item
    calculateTotal() {
        return this.product.price * this.quantity;
    }
}

// 3. CLASS: ShoppingCart
// The main controller class that manages the state of the cart (array of items).
class ShoppingCart {
    constructor() {
        this.items = []; // Array to store ShoppingCartItem instances
    }

    // Method: Get the total of items inside the cart
    getTotal() {
        return this.items.reduce((total, item) => total + item.calculateTotal(), 0);
    }

    // Method: Add items to the cart
    addItem(product, quantity = 1) {
        // Check if item already exists to update quantity instead of duplicating
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const newItem = new ShoppingCartItem(product, quantity);
            this.items.push(newItem);
        }
    }

    // Method: Remove items from the cart based on Product ID
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    // Method: Display cart items (Console + UI Return)
    // In a real-world app, this might just return data, but for this exercise,
    // we are logging to console to demonstrate the object's capability.
    displayCart() {
        if (this.items.length === 0) {
            console.log("The cart is empty.");
        } else {
            console.log("--- Current Cart ---");
            this.items.forEach(item => {
                console.log(`${item.product.name} (x${item.quantity}): $${item.calculateTotal().toFixed(2)}`);
            });
            console.log(`Total: $${this.getTotal().toFixed(2)}`);
        }
    }
}

// --- TESTING & UI INTEGRATION ---

// Initializing the Shopping Cart instance
const myCart = new ShoppingCart();

// Creating 6 Product instances (Mock Database)
const products = [
    new Product(1, "Laptop", 999.99),
    new Product(2, "Smartphone", 599.99),
    new Product(3, "Headphones", 199.99),
    new Product(4, "Smart Watch", 249.50),
    new Product(5, "Tablet", 399.00),
    new Product(6, "Keyboard", 49.99)
];

// Function to render products to the DOM (UI)
function renderProducts() {
    const productList = document.getElementById("product-list");
    
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
}

// Function to render the cart content to the DOM (UI)
function updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    
    // Clear current display
    cartItemsContainer.innerHTML = "";

    if (myCart.items.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        myCart.items.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("cart-item");
            div.innerHTML = `
                <span>${item.product.name} (x${item.quantity}) - $${item.calculateTotal().toFixed(2)}</span>
                <button class="remove-btn" onclick="removeFromCart(${item.product.id})">Remove</button>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    totalPriceElement.innerText = myCart.getTotal().toFixed(2);
    
    // Also run the console display method as requested in instructions
    myCart.displayCart();
}

// Global function to handle Adding items
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        myCart.addItem(product);
        updateCartUI();
    }
};

// Global function to handle Removing items
window.removeFromCart = function(productId) {
    myCart.removeItem(productId);
    updateCartUI();
};

// Initialize the app
renderProducts();
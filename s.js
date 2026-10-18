
/* =========================================
   GLITCHR STORE
   Products, shopping bag and order handling
   ========================================= */


/* 01 — STORE SETTINGS */

const CONFIG = {

    brandName: "GLITCHR",

    currency: "EGP",

    // Replace with the real WhatsApp number.
    // Egypt example: 2010XXXXXXXX
    // Use digits only, without + or spaces.
    whatsappNumber: "+20 12 12221120",

    products: [

        {
            id: "core-hoodie",
            name: "Core Hoodie",
            description: "Minimal branding. Maximum impact.",
            price: 850,
            color: "Black",
            image: "image/d2.png"
        },

        {
            id: "signal-hoodie",
            name: "Signal Hoodie",
            description: "A clean canvas for a loud idea.",
            price: 900,
            color: "White",
            image: "image/d1.jpg.jpg"
        },

        {
            id: "error-hoodie",
            name: "Error Print Hoodie",
            description: "Made to interrupt the pattern.",
            price: 950,
            color: "Black",
            image: "image/d3.jpg"
        }

    ]

};


/* 02 — STORE STATE */

const state = {
    cart: []
};


/* 03 — HELPER FUNCTIONS */

function selectElement(selector) {
    return document.querySelector(selector);
}


function selectAll(selector) {
    return [...document.querySelectorAll(selector)];
}


function formatPrice(price) {
    return `${CONFIG.currency} ${Number(price).toLocaleString("en-US")}`;
}


/* 04 — DISPLAY PRODUCTS */

function renderProducts(products = CONFIG.products) {

    const productGrid = selectElement("#productGrid");

    if (!productGrid) return;

    if (products.length === 0) {
        productGrid.innerHTML = "<p>No products found.</p>";
        return;
    }

    productGrid.innerHTML = products.map(product => {

        const colorClass =
            product.color.toLowerCase() === "white"
                ? "white"
                : "black";

        return `

            <article class="product-card">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </div>


                <div class="product-info">

                    <div class="product-info-top">

                        <h3>${product.name}</h3>

                        <span class="product-price">
                            ${formatPrice(product.price)}
                        </span>

                    </div>


                    <p class="product-description">
                        ${product.description}
                    </p>


                    <div class="product-meta">

                        <div class="color-options">

                            <span
                                class="color-dot ${colorClass}"
                                title="${product.color}"
                            ></span>

                        </div>

                        <button
                            class="add-button"
                            data-add="${product.id}"
                        >
                            Add to Bag +
                        </button>

                    </div>

                </div>

            </article>

        `;

    }).join("");


    // Activate add-to-bag buttons.
    selectAll("[data-add]").forEach(button => {

        button.addEventListener("click", () => {
            addToCart(button.dataset.add);
        });

    });

}


/* 05 — ADD PRODUCT TO BAG */

function addToCart(productId) {

    const product = CONFIG.products.find(item => {
        return item.id === productId;
    });

    if (!product) return;

    const existingItem = state.cart.find(item => {
        return item.id === productId;
    });

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        state.cart.push({
            ...product,
            quantity: 1
        });

    }

    renderCart();

    showToast(`${product.name} added to your bag.`);

}


/* 06 — UPDATE QUANTITY */

function updateQuantity(productId, change) {

    const item = state.cart.find(product => {
        return product.id === productId;
    });

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        state.cart = state.cart.filter(product => {
            return product.id !== productId;
        });

    }

    renderCart();

}


/* 07 — REMOVE PRODUCT */

function removeFromCart(productId) {

    state.cart = state.cart.filter(item => {
        return item.id !== productId;
    });

    renderCart();

}


/* 08 — DISPLAY SHOPPING BAG */

function renderCart() {

    const cartItems = selectElement("#cartItems");
    const cartCount = selectElement("#cartCount");
    const cartSubtotal = selectElement("#cartSubtotal");

    const totalQuantity = state.cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    const subtotal = state.cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);


    cartCount.textContent = totalQuantity;

    cartSubtotal.textContent = formatPrice(subtotal);


    if (state.cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your bag is empty. Let's change that.
            </p>
        `;

        return;

    }


    cartItems.innerHTML = state.cart.map(item => {

        const thumbClass =
            item.color === "White" ? "white-thumb" : "";

        return `

            <div class="cart-item">

                <div class="cart-thumb ${thumbClass}">
                    ${item.color}
                </div>


                <div>

                    <h3>${item.name}</h3>

                    <p>${item.color} / Standard Fit</p>

                    <div class="quantity-control">

                        <button
                            data-quantity="${item.id}"
                            data-change="-1"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            data-quantity="${item.id}"
                            data-change="1"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>

                </div>


                <div>

                    <span class="cart-item-price">
                        ${formatPrice(item.price * item.quantity)}
                    </span>

                    <br>

                    <button
                        class="remove-item"
                        data-remove="${item.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;

    }).join("");


    // Quantity buttons.
    selectAll("[data-quantity]").forEach(button => {

        button.addEventListener("click", () => {

            updateQuantity(
                button.dataset.quantity,
                Number(button.dataset.change)
            );

        });

    });


    // Remove buttons.
    selectAll("[data-remove]").forEach(button => {

        button.addEventListener("click", () => {
            removeFromCart(button.dataset.remove);
        });

    });

}


/* 09 — OPEN AND CLOSE CART */

function openCart() {

    selectElement("#cartDrawer").classList.add("open");

    selectElement("#drawerBackdrop").classList.add("open");

    document.body.classList.add("no-scroll");

}


function closeCart() {

    selectElement("#cartDrawer").classList.remove("open");

    selectElement("#drawerBackdrop").classList.remove("open");

    document.body.classList.remove("no-scroll");

}


/* 10 — NOTIFICATIONS */

function showToast(message) {

    const toast = selectElement("#toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* 11 — WHATSAPP */

function sendToWhatsApp(message) {

    const number = CONFIG.whatsappNumber.replace(/\D/g, "");

    // Prevent opening WhatsApp until the real number is configured.
    if (!number || number === "201000000000") {

        showToast("Add your real WhatsApp number in script.js.");

        return;

    }

    const url =
        `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");

}

/* =========================================
12 — WHATSAPP CHECKOUT
========================================= */

function checkout() {


if (state.cart.length === 0) {
    showToast("Your bag is empty.");
    return;
}

const orderLines = state.cart.map((item, index) => {

    const itemTotal = item.price * item.quantity;

    return [
        `${index + 1}. ${item.name}`,
        `   Color: ${item.color}`,
        `   Quantity: ${item.quantity}`,
        `   Unit Price: ${formatPrice(item.price)}`,
        `   Product Total: ${formatPrice(itemTotal)}`
    ].join("\n");

});

const subtotal = state.cart.reduce((total, item) => {
    return total + item.price * item.quantity;
}, 0);

const message = [
    "🖤 GLITCHR — NEW ORDER",
    "━━━━━━━━━━━━━━━━━━",
    "",
    "",
    "📦 ORDER DETAILS",
    "",
    ...orderLines,
    "",
    "━━━━━━━━━━━━━━━━━━",
    "💰 PAYMENT SUMMARY",
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    "Shipping: To be confirmed",
    `Total Before Shipping: ${formatPrice(subtotal)}`,
    "",
    "━━━━━━━━━━━━━━━━━━",
    "📋 CUSTOMER DETAILS",
    "",
    "Name: ",
    "Phone: ",
    "Governorate: ",
    "Full Address: ",
    "",
    "━━━━━━━━━━━━━━━━━━",
    "📏 SIZE DETAILS",
    "",
    "Please confirm the size for each item.",
    "Available sizes: S / M / L / XL / XXL",
    "",
    "Payment Method: Cash on Delivery",
    "",
    "Thank you for choosing GLITCHR 🖤"
].join("\n");

sendToWhatsApp(message);


}


/* 13 — CUSTOM PRINT FORM */

function handleCustomOrder(event) {

    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form);


    const customerName =
        String(formData.get("name") || "").trim();

    const customerPhone =
        String(formData.get("phone") || "").trim();

    const color =
        String(formData.get("color") || "");

    const size =
        String(formData.get("size") || "");

    const details =
        String(formData.get("details") || "").trim();

    const designFile =
        formData.get("designFile");


    const fileName =
        designFile && designFile.name
            ? designFile.name
            : "Will send separately on WhatsApp";


    const message = [

        `Hello ${CONFIG.brandName}! I want a custom hoodie.`,

        "",

        `Name: ${customerName}`,

        `WhatsApp: ${customerPhone}`,

        `Hoodie Color: ${color}`,

        `Size: ${size}`,

        `Design Details: ${details}`,

        `Design File: ${fileName}`,

        "",

        "Please confirm the price, print options and delivery time."

    ].join("\n");


    selectElement("#formFeedback").textContent =
        "Your request is ready. If WhatsApp opens, attach your design file in the chat.";


    sendToWhatsApp(message);

}


/* 14 — SEARCH */

function handleSearch(event) {

    const query = event.target.value.trim().toLowerCase();

    const filteredProducts = CONFIG.products.filter(product => {

        const productText =
            `${product.name} ${product.description} ${product.color}`;

        return productText.toLowerCase().includes(query);

    });

    renderProducts(filteredProducts);

}


/* 15 — MOBILE MENU */

function toggleMenu() {

    const nav = selectElement("#mainNav");

    nav.classList.toggle("open");

}


/* 16 — CONNECT EVENTS */

function setupEventListeners() {

    // Cart.
    selectElement("#cartOpen").addEventListener("click", openCart);

    selectElement("#cartClose").addEventListener("click", closeCart);

    selectElement("#drawerBackdrop").addEventListener("click", closeCart);

    selectElement("#checkoutButton").addEventListener("click", checkout);


    // Search.
    selectElement("#searchToggle").addEventListener("click", () => {

        selectElement("#searchPanel").classList.add("open");

        selectElement("#productSearch").focus();

    });

    selectElement("#searchClose").addEventListener("click", () => {

        selectElement("#searchPanel").classList.remove("open");

    });

    selectElement("#productSearch").addEventListener("input", handleSearch);


    // Mobile navigation.
    selectElement("#menuToggle").addEventListener("click", toggleMenu);

    selectAll("#mainNav a").forEach(link => {

        link.addEventListener("click", () => {

            selectElement("#mainNav").classList.remove("open");

        });

    });


    // Custom order form.
    selectElement("#customOrderForm").addEventListener(
        "submit",
        handleCustomOrder
    );


    // Escape key.
    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeCart();

            selectElement("#searchPanel").classList.remove("open");

            selectElement("#mainNav").classList.remove("open");

        }

    });

}


/* 17 — INITIALIZE WEBSITE */

function initStore() {

    renderProducts();

    renderCart();

    setupEventListeners();

}


// Start the website.
initStore();
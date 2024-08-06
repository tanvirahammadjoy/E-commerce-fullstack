document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");
  fetchFeaturedProducts();
  loadCartItems();
});

async function fetchFeaturedProducts() {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/products");
    const result = await response.json();
    const products = result.data.products;
    console.log("Fetched products:", products);
    displayFeaturedProducts(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }
}

function displayFeaturedProducts(products) {
  const productsContainer = document.getElementById("featured-products");
  if (!productsContainer) {
    console.warn("Element with ID 'featured-products' not found");
    return;
  }
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    console.log("Product image URL:", product.image); // Debugging line
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price">$${product.price}</div>
      <button class="add-to-cart" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
    `;
    productsContainer.appendChild(productDiv);
  });

  attachAddToCartListeners();
}

function attachAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  console.log("Found add-to-cart buttons:", addToCartButtons.length);
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        image: button.dataset.image,
        quantity: 1,
      };
      console.log("Adding product to cart:", product);
      addToCart(product);
    });
  });
}

async function loadCartItems() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }

    console.log("Token being sent:", token);

    const response = await fetch("http://127.0.0.1:3000/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      const cart = result.data;
      console.log("Loaded cart items:", cart);

      if (Array.isArray(cart.products)) {
        console.log("Cart products:", cart.products); // Debugging line
        displayCartItems(cart.products);
        updateCartSummary(cart.products);
      } else {
        console.error("Cart products is not an array:", cart.products);
        throw new Error("Cart products is not an array");
      }
    } else {
      const errorResponse = await response.json();
      console.error("Error loading cart items:", errorResponse.message);
    }
  } catch (error) {
    console.error("Error loading cart items:", error.message);
  }
}

async function addToCart(product) {
  try {
    const token = localStorage.getItem("accessToken"); // Ensure key is correct
    if (!token) {
      throw new Error("No token found");
    }

    console.log("Token being sent:", token);

    const response = await fetch("http://127.0.0.1:3000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: product.quantity,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const cart = result.data; // Adjust according to the actual response structure
      console.log("Cart updated:", cart);
      displayCartItems(cart.products); // Use cart.products here
      updateCartSummary(cart.products); // Use cart.products here
    } else {
      const errorResponse = await response.json();
      console.error("Error adding product to cart:", errorResponse.message);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error.message);
  }
}

function displayCartItems(products) {
  const cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) {
    console.warn("Element with ID 'cart-items' not found");
    return;
  }
  cartItemsContainer.innerHTML = "";

  products.forEach((product) => {
    const imageUrl = product.product.image || ""; // Adding .product to correctly reference nested object
    const name = product.product.name || "No name provided";
    const price = product.product.price || 0;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
            <img src="${imageUrl}" alt="${name}" />
            <h3>${name}</h3>
            <div class="cart-item-price">$${(price * product.quantity).toFixed(
              2
            )}</div>
            <div class="cart-item-quantity">
                <button class="quantity-decrease" data-id="${
                  product._id
                }">-</button>
                <input type="text" value="${product.quantity}" readonly />
                <button class="quantity-increase" data-id="${
                  product._id
                }">+</button>
            </div>
            <button class="cart-item-remove" data-id="${
              product._id
            }">Remove</button>
        `;
    cartItemsContainer.appendChild(cartItem);
  });

  attachCartEventListeners();
}

function attachCartEventListeners() {
  console.log("Attaching event listeners for cart item actions");

  document.querySelectorAll(".quantity-increase").forEach((button) => {
    button.addEventListener("click", async () => {
      const cart = getCart();
      const product = cart.find((item) => item._id === button.dataset.id);
      if (product) {
        product.quantity++;
        await saveCart(cart);
        loadCartItems();
      }
    });
  });

  document.querySelectorAll(".quantity-decrease").forEach((button) => {
    button.addEventListener("click", async () => {
      const cart = getCart();
      const product = cart.find((item) => item._id === button.dataset.id);
      if (product && product.quantity > 1) {
        product.quantity--;
        await saveCart(cart);
        loadCartItems();
      }
    });
  });

  document.querySelectorAll(".cart-item-remove").forEach((button) => {
    button.addEventListener("click", async () => {
      const cart = getCart();
      const newCart = cart.filter((item) => item._id !== button.dataset.id);
      await saveCart(newCart);
      loadCartItems();
    });
  });
}

function updateCartSummary(products) {
  const totalItemsElement = document.getElementById("total-items");
  const totalPriceElement = document.querySelector(".total-price");

  if (!totalItemsElement || !totalPriceElement) {
    console.warn("Elements for displaying total items or price not found");
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;

  products.forEach((product) => {
    const quantity = parseInt(product.quantity, 10) || 0;
    let price = 0;

    // Check if product and product.price are defined
    if (product.product && typeof product.product.price === "number") {
      price = product.product.price; // Directly using price if it's a number
    } else if (product.product && typeof product.product.price === "string") {
      price =
        parseFloat(product.product.price.replace(/[^\d.-]/g, ""), 10) || 0;
    }

    console.log(
      `Processing product: ${product.product.name}, Price: ${product.product.price}, Parsed Price: ${price}, Quantity: ${quantity}`
    );

    totalItems += quantity;
    totalPrice += price * quantity;
  });

  console.log(
    `Total Items: ${totalItems}, Total Price: ${totalPrice.toFixed(2)}`
  );
  totalItemsElement.textContent = `Total Items: ${totalItems}`;
  totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

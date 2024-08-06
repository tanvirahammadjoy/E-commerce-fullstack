document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");
  loadCartItems();
});

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
        console.log("Cart products:", cart.products);
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

function displayCartItems(products) {
  const cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) {
    console.warn("Element with ID 'cart-items' not found");
    return;
  }
  cartItemsContainer.innerHTML = "";

  products.forEach((product) => {
    const imageUrl = product.product.image || "path/to/default/image.png";
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
                  product.product._id
                }">-</button>
                <input type="text" value="${product.quantity}" readonly />
                <button class="quantity-increase" data-id="${
                  product.product._id
                }">+</button>
            </div>
            <button class="cart-item-remove" data-id="${
              product.product._id
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
      const productId = button.dataset.id;
      console.log(`Quantity Increase - productId: ${productId}`);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `http://127.0.0.1:3000/api/cart/update/${productId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ action: "increase" }),
          }
        );
        if (response.ok) {
          loadCartItems();
        } else {
          console.error("Error increasing quantity:", response.statusText);
        }
      } catch (error) {
        console.error("Error increasing quantity:", error);
      }
    });
  });

  document.querySelectorAll(".quantity-decrease").forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.dataset.id;
      console.log(`Quantity Decrease - productId: ${productId}`);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `http://127.0.0.1:3000/api/cart/update/${productId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ action: "decrease" }),
          }
        );
        if (response.ok) {
          loadCartItems();
        } else {
          console.error("Error decreasing quantity:", response.statusText);
        }
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      }
    });
  });

  document.querySelectorAll(".cart-item-remove").forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.dataset.id;
      console.log(`Remove Item - productId: ${productId}`);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `http://127.0.0.1:3000/api/cart/remove/${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          loadCartItems();
        } else {
          console.error("Error removing item from cart:", response.statusText);
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
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

    if (product.product && typeof product.product.price === "number") {
      price = product.product.price;
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

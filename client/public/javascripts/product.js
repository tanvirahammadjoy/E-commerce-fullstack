document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  if (productId) {
    fetchProductDetails(productId);
  }
});

async function fetchProductDetails(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    const product = await response.json();
    displayProductDetails(product);
    fetchRelatedProducts(product.categoryId);
    fetchProductReviews(productId);
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

function displayProductDetails(product) {
  const productDetailsContainer = document.getElementById("product-details");

  productDetailsContainer.innerHTML = `
    <div class="product-image">
      <img src="${product.imageUrl}" alt="${product.name}">
    </div>
    <div class="product-info">
      <h2>${product.name}</h2>
      <p class="price">$${product.price}</p>
      <p class="description">${product.description}</p>
      <div class="rating">
        <span>Rating: ${product.rating}/5</span>
        <span>${"&#9733;".repeat(product.rating)}${"&#9734;".repeat(
    5 - product.rating
  )}</span>
      </div>
      <button>Add to Cart</button>
    </div>
  `;
}

async function fetchRelatedProducts(categoryId) {
  try {
    const response = await fetch(`/api/products?category=${categoryId}`);
    const relatedProducts = await response.json();
    displayRelatedProducts(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
  }
}

function displayRelatedProducts(products) {
  const relatedProductsContainer = document.getElementById("related-products");
  relatedProductsContainer.innerHTML = "";

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    productDiv.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p class="price">$${product.price}</p>
    `;

    relatedProductsContainer.appendChild(productDiv);
  });
}

async function fetchProductReviews(productId) {
  try {
    const response = await fetch(`/api/reviews?product=${productId}`);
    const reviews = await response.json();
    displayProductReviews(reviews);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
  }
}

function displayProductReviews(reviews) {
  const reviewsContainer = document.getElementById("product-reviews");
  reviewsContainer.innerHTML = "";

  reviews.forEach((review) => {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");

    reviewDiv.innerHTML = `
      <p><strong>${review.user}</strong> - <em>${review.comment}</em></p>
      <div class="rating">
        <span>Rating: ${review.rating}/5</span>
        <span>${"&#9733;".repeat(review.rating)}${"&#9734;".repeat(
      5 - review.rating
    )}</span>
      </div>
    `;

    reviewsContainer.appendChild(reviewDiv);
  });
}

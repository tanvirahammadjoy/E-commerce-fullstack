# client

├── public
│   ├── images
│   ├── javascripts
│   │   ├── main.js                      // Main entry point for JavaScript
│   │   ├── cart.js                      // JavaScript for cart functionality
│   │   ├── comment.js                   // JavaScript for comment functionality
│   │   ├── dashboard.js                 // JavaScript for dashboard functionality
│   │   ├── like.js                      // JavaScript for like functionality
│   │   ├── order.js                     // JavaScript for order functionality
│   │   ├── product.js                   // JavaScript for product functionality
│   │   ├── rate.js                      // JavaScript for rate functionality
│   │   ├── user.js                      // JavaScript for user functionality
│   │   ├── search.js                    // JavaScript for search functionality
│   │   ├── category.js                  // JavaScript for category functionality
│   │   ├── wishlist.js                  // JavaScript for wishlist functionality
│   ├── stylesheets
│   │   ├── main.css                     // Main stylesheet
│   │   ├── home.css
│   │   ├── product.css
│   │   ├── register.css
│   │   ├── login.css
│   │   ├── error.css
│   │   ├── cart.css                     // CSS for cart page
│   │   ├── comment.css                  // CSS for comment section
│   │   ├── dashboard.css                // CSS for dashboard
│   │   ├── like.css                     // CSS for like functionality
│   │   ├── order.css                    // CSS for order page
│   │   ├── rate.css                     // CSS for rate functionality
│   │   ├── user-profile.css             // CSS for user profile
│   │   ├── search.css                   // CSS for search page
│   │   ├── category.css                 // CSS for category pages
│   │   ├── wishlist.css                 // CSS for wishlist page
│   ├── index.html                       // Main HTML file
│   ├── cart.html                        // HTML file for cart page
│   ├── product.html                     // HTML file for product page
│   ├── login.html                       // HTML file for login page
│   ├── register.html                    // HTML file for registration page
│   ├── search.html                      // HTML file for search page
│   ├── category.html                    // HTML file for category pages
│   ├── wishlist.html                    // HTML file for wishlist page
│   ├── error400.html
│   ├── error500.html
│   └── favicon.ico
├── src
│   ├── assets
│   │   ├── fonts
│   │   └── icons
│   ├── components                       // Reusable UI components
│   │   ├── cart
│   │   │   ├── cartItem.js
│   │   │   └── cart.js
│   │   ├── comment
│   │   │   ├── commentList.js
│   │   │   ├── commentForm.js
│   │   │   └── comment.js
│   │   ├── dashboard
│   │   │   └── dashboard.js
│   │   ├── like
│   │   │   └── likeButton.js
│   │   ├── order
│   │   │   └── order.js
│   │   ├── product
│   │   │   ├── productCard.js
│   │   │   ├── productDetails.js
│   │   │   └── productList.js
│   │   ├── rate
│   │   │   └── rate.js
│   │   ├── search
│   │   │   ├── searchBar.js
│   │   │   └── searchResults.js
│   │   ├── category
│   │   │   └── categoryList.js
│   │   ├── wishlist
│   │   │   ├── wishlistItem.js
│   │   │   └── wishlist.js
│   │   └── user
│   │       ├── userProfile.js
│   │       └── userAuth.js
│   ├── services                         // API calls and other service functions
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── cartService.js
│   │   ├── commentService.js
│   │   ├── productService.js
│   │   ├── searchService.js
│   │   ├── categoryService.js
│   │   ├── wishlistService.js
│   │   └── userService.js
│   ├── utils                            // Utility functions
│   │   ├── validation.js
│   │   ├── apiErrorHandling.js
│   │   ├── apiResponseFormatting.js
│   │   └── tokenUtils.js
│   ├── app.js                           // Main App component
│   ├── app.css
│   └── index.js                         // Entry point for JavaScript
├── .gitignore
├── package.json
├── README.md                            // Project documentation
└── tests                                // Tests folder (if applicable)
    ├── unit
    └── integration

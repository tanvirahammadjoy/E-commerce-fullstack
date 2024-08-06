# Project Summary

Overview
This project is an e-commerce website built using modern web technologies. It encompasses a full-stack approach with a structured file organization for both client and server sides. The project covers user authentication, product management, shopping cart functionalities, and order processing.

Technologies Used
Frontend:
HTML, CSS, JavaScript
Backend:
Node.js, Express.js
MongoDB
Cloudinary for image storage
JWT for authentication

Libraries and Tools:
bcrypt for password hashing
express-validator for validation
cors for cross-origin resource sharing

Project Structure

Client Side
public/: Contains static files like images, stylesheets, and scripts.
components/: Reusable UI components.
services/: Handles API calls and other services.
utilities/: Utility functions.
index.html: The main HTML file.
script.js: Main JavaScript file for client-side logic.
styles.css: Main stylesheet.

Server Side
configs/: Configuration files.
controllers/: Logic for handling requests.
db/: Database setup and models.
middlewares/: Custom middleware functions.
models/: Database models.
routes/: Route definitions.
services/: Business logic services.
utils/: Utility functions.
app.js: Main server file.
index.js: Server entry point.
Features Implemented
User Authentication:

Registration and login using Passport.js.
Secure password storage using bcrypt.
JWT-based authentication for protected routes.

Product Management:
CRUD operations for products.
Image uploads using Cloudinary.

Shopping Cart:
Add, update, and remove items from the cart.
Display cart items with their quantities and total price.

Order Processing:
Create and manage orders.
Secure routes for handling order-related operations.

Global Error Handling:
Centralized error handling middleware.
Custom error classes for API responses.
Middleware and Routing

Middleware:
express.json() and express.urlencoded() for parsing JSON and URL-encoded data.
cookieParser() for handling cookies.
cors for enabling cross-origin requests.
Custom error handling middleware.

Routing:
userRoutes for user-related endpoints.
productRoutes for product-related endpoints.
cartRoutes for cart-related endpoints.
commentRoutes, likeRoutes, rateRoutes for additional functionalities.
dashboardRoutes for admin dashboard functionalities.
orderRoutes for order management.

Client-Side JavaScript
Event Listeners:
Load cart items and featured products on DOMContentLoaded event.
Attach event listeners for cart item actions (increase, decrease, remove).
Attach event listeners for adding products to the cart.

Fetch API:
Make API calls to backend endpoints for cart and product operations.
Handle authentication tokens stored in localStorage.

DOM Manipulation:
Dynamically update the cart and product display on the webpage.
Update cart summary with total items and price.
Backend Controllers

Cart Controller:
Add products to the cart.
Get user's cart.
Update product quantity in the cart.
Remove products from the cart.
Lessons Learned

Full-Stack Development:
Understanding the flow of data from the frontend to the backend.
Structuring a project with clear separation of concerns.

Authentication and Security:
Implementing secure user authentication with JWT.
Protecting routes and ensuring data validation.
API Development:

Creating RESTful endpoints for CRUD operations.
Handling asynchronous operations with async/await.

Error Handling:
Centralizing error handling in the backend.
Providing meaningful error messages to the client.

State Management:
Managing application state on the client side.
Syncing frontend state with backend data.
This project has provided a comprehensive understanding of building a modern web application from scratch, covering both frontend and backend development, and implementing essential features for an e-commerce platform.

## PROJECTECOMMERCE3

Root folder
client
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
│   ├── index.html                       // Main HTML file
│   ├── cart.html                        // HTML file for cart page
│   ├── product.html                     // HTML file for product page
│   ├── login.html                       // HTML file for login page
│   ├── register.html                    // HTML file for registration page
│   ├── error400.html
│   ├── error500.html
│   └── favicon.ico                   // Entry point for JavaScript
├── .gitignore
├── package.json
├── README.md                            // Project documentation
│
├── server
│   ├── public
│   ├── src
│   │   ├── configs
│   │   │   └── db.config.js               // Database configuration details
│   │   │
│   │   ├── controllers
│   │   │   ├── cart.controller.js         // Controller for cart-related operations
│   │   │   ├── comment.controller.js      // Controller for comment-related operations
│   │   │   ├── dashboard.controller.js    // Controller for dashboard-related operations
│   │   │   ├── like.controller.js         // Controller for like-related operations
│   │   │   ├── order.controller.js        // Controller for order-related operations
│   │   │   ├── product.controller.js      // Controller for product-related operations
│   │   │   ├── rate.controller.js         // Controller for rate-related operations
│   │   │   └── users.controller.js        // Controller for user-related operations
│   │   │
│   │   ├── db
│   │   │   ├── migrations                 // Directory for database migration files
│   │   │   │   ├── 20210728123456-add-example-field.js // Example migration file
│   │   │   ├── seeders                    // Directory for database seed files
│   │   │   │   ├── user.seeder.js         // Seeder for user-related data
│   │   │   ├── connection.js              // File for setting up database connection
│   │   │   ├── migrate-mongo-config.js    // Migrate-mongo configuration file
│   │   │   └── seed.js                    // File to execute seeder files
│   │   │
│   │   ├── middlewares
│   │   │   ├── authenticateToken.js          // Middleware for authentication
│   │   │   ├── errorHandler.js            // Middleware for handling errors
|   |   |   |-- rateLimiter.js
│   │   │   └── multerMiddleware.js        // Middleware for handling file uploads
│   │   │
│   │   ├── models
│   │   │   ├── cart.model.js              // Model for cart-related data
│   │   │   ├── comment.model.js           // Model for comment-related data
│   │   │   ├── like.model.js              // Model for like-related data
│   │   │   ├── order.model.js             // Model for order-related data
│   │   │   ├── product.model.js           // Model for product-related data
│   │   │   ├── rate.model.js              // Model for rate-related data
│   │   │   └── user.model.js              // Model for user-related data
│   │   │
│   │   ├── routes
│   │   │   ├── cart.routes.js             // Routes for cart-related endpoints
│   │   │   ├── comment.routes.js          // Routes for comment-related endpoints
│   │   │   ├── dashboard.routes.js        // Routes for dashboard-related endpoints
│   │   │   ├── like.routes.js             // Routes for like-related endpoints
│   │   │   ├── order.routes.js            // Routes for order-related endpoints
│   │   │   ├── product.routes.js          // Routes for product-related endpoints
│   │   │   ├── rate.routes.js             // Routes for rate-related endpoints
│   │   │   └── user.routes.js             // Routes for user-related endpoints
│   │   │
│   │   ├── services
│   │   │   ├── authService.js             // Service for authentication logic
│   │   │   └── productService.js          // Service for product-related logic
│   │   │
│   │   ├── utils
│   │   │   ├── apiError.js                // Utility for API error handling
│   │   │   ├── apiResponse.js             // Utility for API response formatting
│   │   │   ├── asyncHandler.js            // Utility for handling asynchronous operations
│   │   │   ├── cloudinary.js              // Utility for interacting with Cloudinary
│   │   │   ├── tokenUtils.js              // Utility for token generation, validation, etc.
│   │   │   ├── validationUtil.js          // Utility for validating data
│   │   │   └── logger.js                  // Utility for logging
│   │   │
│   │   ├── views
│   │   │   ├── error.ejs                  // View template for error pages
│   │   │   └── index.ejs                  // View template for the main page
│   │   │
│   │   ├── app.js                         // Main application file
│   │   ├── consent.js                     // File for managing user consents
│   │   └── index.js                       // Entry point of the application
│
├── .env
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package-lock.json
├── package.json
└── readme.md

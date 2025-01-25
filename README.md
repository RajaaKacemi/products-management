## products-management

# Overview

This project is a Node.js application that provides an API for managing product inventory and reservations using Firestore as the database.

# Features

- Retrieve a list of all products
- Create a new product
- Delete a product
- Create a reservation for a product
- Cancel a reservation
- Check product availability and expiration status before allowing reservations

# Setup

- Install Node.js and npm on your system.
- Clone the project repository.
- Run npm install to install the project dependencies.
- Set up a Firestore database and obtain the necessary credentials. (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY,)
- Create a .env file in the project root directory and add your Firestore configuration details.
- Start the server using npm start.

# API Endpoints

- GET /produits: Retrieve all products.
- POST /produits: Create a new product.
- DELETE /produits/:id: Delete a product.
- POST /reservations: Create a new reservation.
- DELETE /reservations/:id: Cancel a reservation.

# Data Model

- # Products Collection
- codeBarre: Unique identifier for the product.
- name: Product name.
- expirationDate: Product expiration date.
- quantity: Current product quantity in stock.
- price: Product price.
- stores: List of stores where the product is available.

- # Reservations Collection
- clientname: name of the client making the reservation.
- codeBarre: code of the reserved product.
- quantity: Quantity of the product reserved.
- dateReservation: Date and time of the reservation.
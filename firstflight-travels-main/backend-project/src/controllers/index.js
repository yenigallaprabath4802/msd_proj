// src/controllers/index.js

// Function to get all items
export const getAllItems = (req, res) => {
    // Logic to retrieve all items from the database
    res.send("All items retrieved");
};

// Function to create a new item
export const createItem = (req, res) => {
    // Logic to create a new item in the database
    res.send("New item created");
};
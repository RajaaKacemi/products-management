const { db } = require('../firebase.js');

const getAllProducts = async (req, res) => {
    try {
        const productsRef = db.collection('Products');
        const productsDoc = await productsRef.get();

        if (productsDoc.empty) {
            return res.status(404).json({ message: "No products found" });
        }

        const products = [];
        productsDoc.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json({ message: products });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addProduct = async (req, res) => {
    const { barcode, name, stores, expirationDate, quantity, price } = req.body;

    try {
        if (!barcode || !name || !stores || !expirationDate || !quantity || !price) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        await db.collection('Products').doc(barcode).set({
            name,
            stores,
            expirationDate,
            quantity,
            price,
        });

        return res.status(200).json({ message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const productDocRef = db.collection("Products").doc(productId);
        const productDoc = await productDocRef.get();

        if (!productDoc.exists) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        await productDocRef.delete();
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllProducts,
    addProduct,
    deleteProduct,
};
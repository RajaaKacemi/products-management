const express = require('express')
require('dotenv').config();

const app = express()

const port = 3000

const { db } = require('./firebase.js')

app.use(express.json())

// gestion des produits

app.get('/products', async (req, res) => {
    try{
        const productsRef = db.collection('Products')
        const productsDoc = await productsRef.get()

        if (productsDoc.empty) {
            return res.status(404).json({"message": "No products found"})
        }

        const products = [];
            productsDoc.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        })

        return res.status(200).json({message:products})
    }catch(error){
        return res.status(500).json({message: 'Internal Server Error'});
    }
})

app.post('/products', async (req, res) => {
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
        return res.status(500).json({message: 'Internal Server Error'});
    }
});


app.delete('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    try{
        const productDocRef = db.collection("Products").doc(productId)
        const productDoc = await productDocRef.get();

        if(!productDoc.exists) return res.status(404).json({message:"Product dosen't exist"});

        await productDocRef.delete();
        return res.status(200).json({message:"Product deleted successfully"});
        
    }catch(error){
        console.error("Error at deleting a product: ", error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
})

//gestion des Réservations

app.get('/reservations', async (req, res) => {
    try{
        const reservationRef = db.collection('Reservations')
        const reservationsDoc = await reservationRef.get()

        if (reservationsDoc.empty) {
            return res.status(404).json({"message": "No reservations found"})
        }

        const reservations = [];
            reservationsDoc.forEach(doc => {
            reservations.push({ id: doc.id, ...doc.data() });
        })

        return res.status(200).json({message:reservations})
    }catch(error){
        console.error("Error fetching reservations: ", error);
        return res.status(500).json({message:"Internal Server Error"});
    }
})

app.post('/reservations', async (req, res) => {
    const { productId, clientName, quantity } = req.body;

    try {

    if (!productId || !clientName || !quantity) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const productRef = db.collection('Products').doc(productId);
    const productDoc= await productRef.get();

    if(!productDoc.exists){
        return res.status(404).json({ message: 'Product dosen\'t exist.'});
    }

    if (productDoc.data().quantity < quantity) {
      return res.status(400).json({ message: `Quantity dosen\'t exist, quantity available is: ${productDoc.data().quantity}`});
    }


    if(new Date(productDoc.data().expirationDate) < new Date()) {
        return res.status(400).json({ message: 'Cannot reserve expired product.' });
    }
    
    await db.collection('Reservations').add({ productId, clientName, quantity, dateReservation: new Date() });
    await productRef.update({ quantity: productDoc.data().quantity - quantity });
    
    return res.status(200).json({ message: 'Réservation créée avec succès' });
    } catch (error) {
    console.error('Error creating reservation:', error);
    return res.status(500).json({message: 'Internal Server Error'});
    } 
});


app.delete('/reservations/:reservationId', async (req, res) => {
    const { reservationId } = req.params;

    try{
        const reservationRef = db.collection("Reservations").doc(reservationId);
        const reservationDoc = await reservationRef.get();

        if(!reservationDoc.exists) return res.status(404).json({message:"reservation dosen't exist"});

        const { productId, quantity } = reservationDoc.data();

        const productRef = db.collection("Products").doc(productId);
        const productDoc = await productRef.get()

        if(!productDoc.exists) return res.status(404).json({message:"Product linked to this reservation doesn't exist"});

        const updatedQuantity = productDoc.data().quantity + quantity;
        
        await productRef.update({quantity: updatedQuantity});
        
        await reservationRef.delete();
        return res.status(200).json({message:"reservation deleted successfully"});
        
    }catch(error){
        console.error("Error at deleting a reservation: ", error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
})


app.listen(port, ()=>{
    console.log("Server has started on port: " + port)
})
const { db } = require('../firebase.js');

const getAllReservations = async (req, res) => {
    try {
        const reservationRef = db.collection('Reservations');
        const reservationsDoc = await reservationRef.get();

        if (reservationsDoc.empty) {
            return res.status(404).json({ message: "No reservations found" });
        }

        const reservations = [];
        reservationsDoc.forEach(doc => {
            reservations.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json({ message: reservations });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const addReservation = async (req, res) => {
    const { productId, clientName, quantity } = req.body;

    try {
        if (!productId || !clientName || !quantity) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const productRef = db.collection('Products').doc(productId);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            return res.status(404).json({ message: 'Product doesn\'t exist.' });
        }

        if (productDoc.data().quantity < quantity) {
            return res.status(400).json({ message: `Insufficient quantity, available: ${productDoc.data().quantity}` });
        }

        if (new Date(productDoc.data().expirationDate) < new Date()) {
            return res.status(400).json({ message: 'Cannot reserve expired product.' });
        }

        await db.collection('Reservations').add({
            productId,
            clientName,
            quantity,
            dateReservation: new Date(),
        });

        await productRef.update({ quantity: productDoc.data().quantity - quantity });

        return res.status(200).json({ message: 'Reservation créee avec succes' });
    } catch (error) {
        console.error('Error creating reservation:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteReservation = async (req, res) => {
    const { reservationId } = req.params;

    try {
        const reservationRef = db.collection("Reservations").doc(reservationId);
        const reservationDoc = await reservationRef.get();

        if (!reservationDoc.exists) {
            return res.status(404).json({ message: "Reservation doesn't exist" });
        }

        const { productId, quantity } = reservationDoc.data();

        const productRef = db.collection("Products").doc(productId);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            return res.status(404).json({ message: "Product linked to this reservation doesn't exist" });
        }

        const updatedQuantity = productDoc.data().quantity + quantity;
        await productRef.update({ quantity: updatedQuantity });

        await reservationRef.delete();
        return res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllReservations,
    addReservation,
    deleteReservation,
};
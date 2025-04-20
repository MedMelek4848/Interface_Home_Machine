import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";

// ✅ Créer une réservation + mettre à jour la dispo
export const createReservation = async (req, res) => {
  const { userId, hotelId, roomNumbers, dates, price } = req.body;

  try {
    for (const roomId of roomNumbers) {
      const room = await Room.findOne({ "roomNumbers._id": roomId });

      if (!room) {
        return res.status(404).json({ message: `Room ${roomId} not found.` });
      }

      const roomNumber = room.roomNumbers.find((r) => r._id.toString() === roomId);

      const isAvailable = roomNumber.unavailableDates.every(
        (date) => !dates.includes(new Date(date).getTime())
      );

      if (!isAvailable) {
        return res.status(400).json({ message: `Room ${roomId} is not available.` });
      }
    }

    for (const roomId of roomNumbers) {
      await Room.updateOne(
        { "roomNumbers._id": roomId },
        {
          $push: {
            "roomNumbers.$.unavailableDates": { $each: dates },
          },
        }
      );
    }

    const newReservation = new Reservation({
      userId,
      hotelId,
      roomNumbers,
      dates,
      price,
    });

    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la réservation", error: err.message });
  }
};

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("userId", "username")
      .populate("hotelId", "name");

    const enriched = await Promise.all(
      reservations.map(async (res) => {
        const roomDocs = await Room.find({
          "roomNumbers._id": { $in: res.roomNumbers },
        });

        const roomNums = [];
        roomDocs.forEach((room) => {
          room.roomNumbers.forEach((rn) => {
            if (res.roomNumbers.map((id) => id.toString()).includes(rn._id.toString())) {
              roomNums.push(rn.number);
            }
          });
        });

        return {
          ...res._doc,
          roomNumbers: roomNums,
        };
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteReservation = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).json("Réservation supprimée !");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const hasUserReservedHotel = async (req, res) => {
    const { userId, hotelId } = req.params;
    try {
      const reservation = await Reservation.findOne({ userId, hotelId });
      res.status(200).json({ hasReserved: !!reservation });
    } catch (err) {
      console.error("Erreur lors de la vérification :", err);
      res.status(500).json({ error: err.message });
    }
  };
  
// Exemple d'API backend dans le contrôleur de réservation
export const getUserReservations = async (req, res) => {
    try {
      const userId = req.user.id;
      const reservations = await Reservation.find({ userId }).populate("hotelId", "name");
  
      const detailedReservations = await Promise.all(reservations.map(async (reservation) => {
        const rooms = await Room.find({
          '_id': { $in: reservation.roomNumbers },
        });
  
        // Extraire tous les numéros de chambre à partir de chaque objet Room
        const roomDetails = rooms.flatMap(room =>
          room.roomNumbers.map(rn => rn.number) // rn = roomNumber object
        );
  
        return {
          ...reservation._doc,
          roomNumbers: roomDetails,
          dates: reservation.dates.map(date => new Date(date).toLocaleDateString()),
        };
      }));
  
      res.status(200).json(detailedReservations);
    } catch (err) {
      res.status(500).json({
        message: "Erreur lors de la récupération des réservations utilisateur",
        error: err.message,
      });
    }
  };
  
  
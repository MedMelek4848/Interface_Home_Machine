import Review from "../models/Review.js";
import Reservation from "../models/Reservation.js";
import mongoose from "mongoose";

// Ajouter un avis
export const addReview = async (req, res) => {
    const { userId, hotelId, comment, rating } = req.body;
  
    // Vérifie si l'utilisateur a réservé cet hôtel
    const hasReserved = await Reservation.findOne({ userId, hotelId });
    if (!hasReserved) {
      return res.status(403).json({ message: "Vous devez réserver avant de laisser un avis." });
    }
  
    // Vérifie s’il a déjà laissé un avis
    const alreadyReviewed = await Review.findOne({ userId, hotelId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Vous avez déjà laissé un avis pour cet hôtel." });
    }
  
    // Crée un nouvel avis
    try {
      const newReview = new Review({
        userId,
        hotelId,
        comment,
        rating,
      });
  
      const savedReview = await newReview.save();
      res.status(201).json(savedReview); // Renvoie l'avis enregistré
    } catch (err) {
      res.status(500).json({ error: err.message }); // Gère les erreurs côté serveur
    }
  };
  // Récupérer les avis pour un hôtel donné
export const getReviewsByHotel = async (req, res) => {
    try {
      const reviews = await Review.find({ hotelId: req.params.hotelId })
        .populate('userId', 'username') // Vous pouvez ajouter d'autres champs selon vos besoins
        .exec();
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching reviews' });
    }
  };
  

// Récupérer les avis d’un hôtel
export const getHotelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hotelId: req.params.hotelId }).populate("userId", "username");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Moyenne des notes d’un hôtel
export const getHotelAverageRating = async (req, res) => {
  try {
    const result = await Review.aggregate([
      { $match: { hotelId: new mongoose.Types.ObjectId(req.params.hotelId) } },
      { $group: { _id: "$hotelId", avgRating: { $avg: "$rating" } } }
    ]);
    const average = result[0]?.avgRating || 0;
    res.status(200).json({ averageRating: average });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

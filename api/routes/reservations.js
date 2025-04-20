import express from "express";
import { createReservation, deleteReservation, getReservations } from "../controllers/reservation.js";
import { verifyToken } from "../utils/verifyToken.js";
import * as reservation from '../controllers/reservation.js'; // Correction ici

const router = express.Router();

// Route pour créer une réservation
router.post("/", createReservation); // POST /api/reservations
router.get("/", getReservations); // GET /api/reservations
router.delete("/:id", deleteReservation);
router.get('/hasUserReservedHotel/:userId/:hotelId', verifyToken, reservation.hasUserReservedHotel);
router.get("/myreservation", verifyToken, reservation.getUserReservations); // GET /api/reservations/myreservation
export default router;

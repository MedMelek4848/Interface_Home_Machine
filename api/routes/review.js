import express from "express";
import { addReview, getHotelReviews, getHotelAverageRating, getReviewsByHotel } from "../controllers/review.js";

const router = express.Router();

router.post("/", addReview);
router.get("/:hotelId", getHotelReviews);
router.get("/average/:hotelId", getHotelAverageRating);
router.get('/:hotelId', getReviewsByHotel);

export default router;

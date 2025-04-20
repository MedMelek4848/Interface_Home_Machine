import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomNumbers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }],
    dates: { type: [Date], required: true }, // Tableau des dates réservées
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", ReservationSchema);
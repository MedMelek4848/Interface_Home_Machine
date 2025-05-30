import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import reservationRoutes from "./routes/reservations.js";
import reviewRoute from "./routes/review.js";
import uploadRoute from "./routes/upload.js"; // Route d'upload d'images
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Fonction pour obtenir le chemin absolu du répertoire courant
const __dirname = path.resolve();

// Configuration de l'application
const app = express();
dotenv.config();

// Connexion à la base de données MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// Middlewares
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3002"],// ou l'URL de ton frontend
  credentials: true,               // IMPORTANT pour les cookies
}));
app.use(cookieParser());
app.use(express.json());


// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use('/api/reservations', reservationRoutes);
app.use("/api/reviews", reviewRoute);
app.use("/api/upload", uploadRoute); // Route d'upload
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
// Serve les fichiers statiques depuis le dossier "uploads"
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err);  // Affiche l'erreur complète dans la console
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// Lancement du serveur
app.listen(8800, () => {
  connect();
  console.log("Backend is running on port 8800.");
});

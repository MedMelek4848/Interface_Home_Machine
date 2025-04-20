import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configuration du stockage Multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join("public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Spécifie le dossier où stocker les fichiers
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Nom unique pour chaque fichier
  },
});

// Initialisation de Multer avec la configuration de stockage
const upload = multer({ storage: storage });

// Route POST pour l'upload d'images
router.post("/", upload.array("files"), (req, res) => {
  try {
    // Récupérer les chemins des fichiers uploadés
    const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
    res.status(200).json({ files: filePaths }); // Retourne les chemins des fichiers uploadés
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'upload de l'image.", error: err.message });
  }
});

export default router;

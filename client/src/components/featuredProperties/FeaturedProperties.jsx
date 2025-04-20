import React, { useContext, useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./featuredProperties.css";

const FeaturedProperties = () => {
  const { data, loading } = useFetch("/hotels?featured=true&limit=4");
  const { user } = useContext(AuthContext);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasReserved, setHasReserved] = useState(false);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]); // State to store reviews

  // Fetch reviews for the selected hotel
  const getReviews = async (hotelId) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/reviews/${hotelId}`,
        { withCredentials: true }
      );
      setReviews(res.data); // Update state with fetched reviews
    } catch (err) {
      console.error("Erreur de récupération des avis :", err);
    }
  };

  const handleHotelClick = async (hotel) => {
    if (!user) {
      alert("Vous devez être connecté pour noter un hôtel.");
      return;
    }

    setSelectedHotel(hotel);
    setIsModalOpen(true);

    try {
      const res = await axios.get(
        `http://localhost:8800/api/reservations/hasUserReservedHotel/${user._id}/${hotel._id}`,
        { withCredentials: true }
      );
      setHasReserved(res.data.hasReserved);
      // Fetch reviews after opening the modal
      getReviews(hotel._id);
    } catch (err) {
      console.error("Erreur de vérification de réservation :", err);
      setHasReserved(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
    setRating("");
    setComment("");
  };

  const submitReview = async () => {
    if (!rating || !comment) {
      alert("Veuillez choisir une note et écrire un commentaire !");
      return;
    }
  
    try {
      const res = await axios.post(
        "http://localhost:8800/api/reviews",
        {
          userId: user._id,
          hotelId: selectedHotel._id,
          rating: Number(rating),
          comment,
        },
        { withCredentials: true }
      );
      alert("Merci pour votre avis !");
      closeModal();
    } catch (err) {
      console.error("Erreur d'envoi de l'avis :", err);
      alert("Erreur lors de l'envoi de l'avis.");
    }
  };
  
  return (
    <div className="fp">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        data.map((item) => (
          <div
            className="fpItem"
            key={item._id}
            onClick={() => handleHotelClick(item)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={`http://localhost:8800${item.photos?.[0] || "/default.jpg"}`}
              alt={item.name}
              className="fpImg"
              onError={(e) => (e.target.src = "/default.jpg")}
            />
            <span className="fpName">{item.name}</span>
            <span className="fpCity">{item.city}</span>
            <span className="fpPrice">À partir de {item.cheapestPrice} TND</span>
            {item.rating && (
              <div className="fpRating">
                <button>{item.rating}</button>
                <span>Excellent</span>
              </div>
            )}
          </div>
        ))
      )}

      {isModalOpen && selectedHotel && (
        <div className="hotelModal">
          <div className="modalOverlay" onClick={closeModal}></div>
          <div className="modalContent">
            <button className="closeModal" onClick={closeModal}>
              &times;
            </button>
            <div className="modalDetails">
              <img
                src={`http://localhost:8800${selectedHotel.photos?.[0] || "/default.jpg"}`}
                alt={selectedHotel.name}
                className="modalImg"
              />
              <div className="modalInfo">
                <h2>{selectedHotel.name}</h2>
                <p>{selectedHotel.city}</p>
                <p>{selectedHotel.address}</p>
                <p>Distance : {selectedHotel.distance}</p>
                <p>{selectedHotel.desc}</p>
                <span>Prix : {selectedHotel.cheapestPrice} TND</span>

                {hasReserved ? (
                  <div className="reviewSection">
                    <label htmlFor="rating">Laissez une note :</label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Sélectionner</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} - {["Mauvais", "Moyen", "Bien", "Très bien", "Excellent"][num - 1]}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="comment">Écrire un commentaire :</label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Votre expérience ici..."
                    ></textarea>

                    <button onClick={submitReview}>Envoyer</button>
                  </div>
                ) : (
                  <p className="infoText">Vous devez réserver pour noter cet hôtel.</p>
                )}

                {/* Display reviews */}
                <div className="reviewsSection">
                  <h3>Avis des clients :</h3>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="reviewItem">
                        <div className="reviewRating">
                          {"★".repeat(review.rating)}{" "}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <p>{review.comment}</p>
                        <small>{`Par ${review.userId.username}`}</small>
                      </div>
                    ))
                  ) : (
                    <p>Aucun avis disponible pour cet hôtel.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProperties;

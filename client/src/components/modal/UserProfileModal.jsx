import "./UserProfileModal.css";
import { useEffect, useState } from "react";
import axios from "axios";

const UserProfileModal = ({ user, onClose }) => {
  const [reservations, setReservations] = useState([]);

  // Récupérer les réservations de l'utilisateur lors de l'ouverture du modal
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/reservations/myreservation`, {
          withCredentials: true,
        });
        setReservations(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des réservations :", err);
      }
    };

    if (user?._id) {
      fetchReservations(); // Récupérer les réservations si l'utilisateur est défini
    }
  }, [user]);

  return (
    <div className="modalOverlay">
    <div className="modalContent">
      <button className="closeBtn" onClick={onClose}>×</button>
      <h2 className="modalTitle">Profil de {user.username}</h2>
  
      <div className="profileContainer">
        <img src={`http://localhost:8800${user.img}`} alt="Avatar" className="profileImg" />
        <div className="userInfo">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Téléphone:</strong> {user.phone}</p>
          <p><strong>Ville:</strong> {user.city}</p>
          <p><strong>Pays:</strong> {user.country}</p>
        </div>
      </div>
  
      <h3 className="reservationTitle">Réservations</h3>
      {reservations.length > 0 ? (
        <ul className="reservationList">
          {reservations.map((r) => (
            <li key={r._id}>
              Hôtel: {r.hotelId?.name} |{" "}
              Créée le: {new Date(r.createdAt).toLocaleDateString()} |{" "}
              Prix: {r.price}€ |{" "}
              Du: {new Date(r.dates[0]).toLocaleDateString()} au {new Date(r.dates[r.dates.length - 1]).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="noReservation">Aucune réservation trouvée.</p>
      )}
    </div>
  </div>
  
  );
};

export default UserProfileModal;

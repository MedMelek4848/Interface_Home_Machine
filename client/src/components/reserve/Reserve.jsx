import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Reserve = ({ setOpen, hotelId, totalPrice }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data } = useFetch(`/hotels/room/${hotelId}`);
  const { dates = [] } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates =
    dates && dates.length > 0
      ? getDatesInRange(dates[0].startDate, dates[0].endDate)
      : [];

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    try {
      if (selectedRooms.length === 0) {
        alert("Veuillez sélectionner au moins une chambre.");
        return;
      }
  
      const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);
  
      const reservationData = {
        userId: user?._id,
        hotelId,
        roomNumbers: selectedRooms,
        dates: alldates,
        price: totalPrice,
      };
  
      const response = await axios.post("/reservations", reservationData); // ✅ récupération dans `response`
  
      if (response.status === 201) {
        alert("Réservation réussie !");
        setOpen(false);
        navigate("/");
      }
    } catch (err) {
      console.error("Erreur lors de la réservation :", err);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data && data.length > 0 ? (
          data.map((item) =>
            item ? (
              <div className="rItem" key={item._id}>
                <div className="rItemInfo">
                  <div className="rTitle">{item.title}</div>
                  <div className="rDesc">{item.desc}</div>
                  <div className="rMax">
                    Max people: <b>{item.maxPeople}</b>
                  </div>
                  <div className="rPrice">Price: {item.price} TND</div>
                </div>
                <div className="rSelectRooms">
                  {item.roomNumbers.map((roomNumber) => (
                    <div className="room" key={roomNumber._id}>
                      <label>{roomNumber.number}</label>
                      <input
                        type="checkbox"
                        value={roomNumber._id}
                        onChange={handleSelect}
                        disabled={!isAvailable(roomNumber)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )
        ) : (
          <p>No rooms available</p>
        )}

        <h3>Total Price: {totalPrice} TND</h3>
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;

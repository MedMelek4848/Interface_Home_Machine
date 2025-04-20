import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState("");

  const { data, loading } = useFetch("/hotels");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    const roomNumbers = rooms
      .split(",")
      .map((room) => ({
        number: parseInt(room.trim(), 10),
        unavailableDates: [],
      }))
      .filter((room) => !isNaN(room.number)); // ignore invalid entries

    try {
      await axios.post(`/rooms/${hotelId}`, { ...info, roomNumbers });
      alert("Room created successfully!");
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Room numbers (comma-separated)</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="Example: 101, 102, 103"
                />
              </div>

              <div className="formInput">
                <label>Choose a hotel</label>
                <select onChange={(e) => setHotelId(e.target.value)} defaultValue="">
                  <option value="" disabled>Select a hotel</option>
                  {loading
                    ? <option>Loading hotels...</option>
                    : data &&
                      data.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>

              <button onClick={handleClick}>Create Room</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;

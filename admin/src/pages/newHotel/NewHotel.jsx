import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewHotel = () => {
  const [files, setFiles] = useState("");  // Pour les fichiers à uploader
  const [info, setInfo] = useState({});  // Informations de l'hôtel
  const [rooms, setRooms] = useState([]); // Chambres sélectionnées
  const TOKEN = JSON.parse(localStorage.getItem("user"))?.token;
  const { data, loading } = useFetch("/rooms"); // Récupérer les chambres disponibles

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setRooms(value);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files); // Mettre à jour les fichiers sélectionnés
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      // Upload des fichiers
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          const data = new FormData();
          data.append("files", file);  // Envoi sous le nom "files"
          const uploadRes = await axios.post("http://localhost:8800/api/upload", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const { files } = uploadRes.data; // Récupérer les URLs des images
          return files[0];
        })
      );

      // Créer un nouvel hôtel avec les données saisies et les URLs des images
      const newhotel = {
        ...info,
        rooms,
        photos: list,
      };

      // Envoi de la requête pour créer l'hôtel
      await axios.post("/hotels", newhotel, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files && files.length > 0
                  ? URL.createObjectURL(files[0]) // Prévisualisation de l'image
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="Hotel preview"
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  name="files" // Nom du champ pour l'upload (doit correspondre à ce que Multer attend)
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              
              <div className="selectRooms">
                <label>Rooms</label>
                <select id="rooms" multiple onChange={handleSelect}>
                  {loading
                    ? "loading"
                    : data &&
                      data.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.title}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;

import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
  
    if (file) {
      const formData = new FormData();
      formData.append("files", file); // clé "files" attendue par le backend
  
      try {
        const response = await axios.post("http://localhost:8800/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        imgUrl = response.data.files[0]; // récupère l'URL du fichier uploadé
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image :", error);
        return; // Stoppe si l'upload échoue
      }
    }
  
    const newUser = {
      ...info,
      img: imgUrl,
      isAdmin,
    };
  
    try {
      const res = await axios.post("http://localhost:8800/api/auth/register", newUser);
      console.log("Utilisateur créé avec succès :", res);
    } catch (error) {
      if (error.response) {
        console.error("Erreur lors de la création de l'utilisateur :", error.response.data.message);
      }
    }
  };
  
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="avatar"
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
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Admin</label>
                <select onChange={(e) => setIsAdmin(e.target.value === "true")}>
                  <option value="false">Non</option>
                  <option value="true">Oui</option>
                </select>
              </div>

              <button onClick={handleClick}>Envoyer</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;

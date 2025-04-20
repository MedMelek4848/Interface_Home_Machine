import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import axios from "axios";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch user connected
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/profile", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur", err);
      }
    };
    fetchUser();
  }, []);

  // Fermer dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login"; // rediriger vers login
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "30px",
      width: "400px",
      borderRadius: "10px",
    },
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div>

        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item profile" ref={dropdownRef}>
            <img
              src={user?.img || "https://i.pravatar.cc/300"}
              alt="avatar"
              className="avatar"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown">
                <div className="dropdownItem" onClick={() => setIsModalOpen(true)}>Profile</div>
                <div className="dropdownItem" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Profil Utilisateur"
        ariaHideApp={false}
      >
        <h2>Mon Profil</h2>
        {user ? (
          <div className="user-details">
            <img src={user.img || "https://i.pravatar.cc/300"} alt="avatar" className="modal-avatar" />
            <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Pays:</strong> {user.country}</p>
            <p><strong>Ville:</strong> {user.city}</p>
            <p><strong>Téléphone:</strong> {user.phone}</p>
            <p><strong>Mot de passe:</strong> ********</p>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
        <button onClick={() => setIsModalOpen(false)}>Fermer</button>
      </Modal>
    </div>
  );
};

export default Navbar;

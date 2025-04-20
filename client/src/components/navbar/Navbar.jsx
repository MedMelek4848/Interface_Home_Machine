import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserProfileModal from "../modal/UserProfileModal";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">lamabooking</span>
        </Link>

        {user ? (
          <div className="navUser" ref={dropdownRef}>
            <div className="userProfile" onClick={toggleDropdown}>
              <img
                src={`http://localhost:8800${user.img || "/default.jpg"}`}
                alt="User"
                className="navAvatar"
              />
              <span className="username">{user.username}</span>
            </div>

            {dropdownOpen && (
              <ul className="dropdownMenu">
                <li onClick={() => { setShowProfile(true); setDropdownOpen(false); }}>Profile</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            )}

            {showProfile && (
              <UserProfileModal user={user} onClose={() => setShowProfile(false)} />
            )}
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register">
              <button className="navButton">Register</button>
            </Link>
            <Link to="/login">
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

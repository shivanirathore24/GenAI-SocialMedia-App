import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // Remove token
    localStorage.removeItem("token");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4">

      <div className="container-fluid">

        {/* App Logo */}
        <span
          className="navbar-brand fw-bold fs-3"
          style={{
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          SocialMedia App 📰
        </span>

        {/* Right Side */}
        <div className="d-flex align-items-center">

          {token && (
            <button
              className="btn btn-outline-light rounded-pill px-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
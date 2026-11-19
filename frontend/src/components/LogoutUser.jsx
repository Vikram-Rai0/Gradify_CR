import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogoutUser = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutUser;

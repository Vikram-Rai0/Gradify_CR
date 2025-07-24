import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:5000/api/logout", {
                withCredentials: true,
            });
            // Clear frontend user state if stored
            localStorage.removeItem("user"); // if you store user manually
            // or update your context/state
            navigate("/login"); // redirect to login
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
        </button>
    );
};

export default LogoutButton;

// components/LogoutUser.jsx
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogoutUser = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/user/logout", {
                withCredentials: true,
            });

            console.log(res.data); // Should be: { message: "Logged out successfully" }

            navigate("/");
        } catch (err) {
            console.error("Logout failed", err.response?.data || err.message);
        }
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

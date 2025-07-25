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

            navigate("/login");
        } catch (err) {
            console.error("Logout failed", err.response?.data || err.message);
        }
    };


    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
        >
            Logout
        </button>
    );
};

export default LogoutUser;

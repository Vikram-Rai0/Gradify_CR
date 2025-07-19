import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { CiUser, CiVoicemail, CiUnlock } from "react-icons/ci";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const UserForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine initial mode based on current route
    const [isSignUp, setIsSignUp] = useState(location.pathname === '/signup');
    const [formdata, setFormData] = useState({
        name: '',
        role: 'Student',
        email: '',
        password: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Sync form mode with route changes
    useEffect(() => {
        setIsSignUp(location.pathname === '/signup');
    }, [location.pathname]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                // Signup logic
                if (formdata.password !== formdata.confirm) {
                    alert("Passwords do not match!");
                    setLoading(false);
                    return;
                }

                if (formdata.password.length < 6) {
                    alert("Password must be at least 6 characters.");
                    setLoading(false);
                    return;
                }

                const res = await axios.post("http://localhost:5000/api/user/signup", {
                    name: formdata.name,
                    email: formdata.email,
                    password: formdata.password,
                    role: formdata.role,
                }, { withCredentials: true });

                alert("Signup successful!");
                console.log(res.data);

                // Switch to login form after successful signup
                navigate("/login");
            } else {
                // Login logic
                const res = await axios.post("http://localhost:5000/api/user/login", {
                    email: formdata.email,
                    password: formdata.password,
                }, { withCredentials: true });

                alert("Login successful!");
                localStorage.setItem("token", res.data.token);
                navigate("/home");
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // Toggle between signup/login forms
    const handleFormToggle = () => {
        const newPath = isSignUp ? "/login" : "/signup";
        navigate(newPath);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
            <div className="flex rounded-xl w-[800px] h-[500px] bg-white shadow-lg overflow-hidden">
                <div className="w-[45%] hidden md:block">
                    <img
                        src="../signupBackground.png"
                        alt="signup"
                        className="h-full w-full object-cover rounded-l-2xl"
                    />
                </div>

                <div className="w-full md:w-[55%] flex justify-center items-center p-6">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col justify-center items-center gap-4 w-full"
                    >
                        <h1 className="text-3xl font-bold text-blue-800">
                            {isSignUp ? 'Sign Up' : 'Login'}
                        </h1>

                        {isSignUp && (
                            <>
                                <div className="relative w-[80%]">
                                    <CiUser className="absolute left-2 top-1/2 -translate-y-1/2 text-green-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formdata.name}
                                        onChange={handleChange}
                                        placeholder="Username"
                                        className="w-full pl-8 py-2 border-b border-gray-400 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="relative w-[80%]">
                                    <label className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Role:</label>
                                    <select
                                        name="role"
                                        value={formdata.role}
                                        onChange={handleChange}
                                        className="w-full pl-16 py-2 border-b border-gray-400 focus:outline-none text-gray-700"
                                        required
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Teacher">Teacher</option>
                                        <option value="Instructor">Instructor</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="relative w-[80%]">
                            <CiVoicemail className="absolute left-2 top-1/2 -translate-y-1/2 text-green-500" />
                            <input
                                type="email"
                                name="email"
                                value={formdata.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full pl-8 py-2 border-b border-gray-400 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="relative w-[80%]">
                            <CiUnlock className="absolute left-2 top-1/2 -translate-y-1/2 text-green-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formdata.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-8 py-2 border-b border-gray-400 focus:outline-none"
                                required
                            />
                            <span
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>

                        {isSignUp && (
                            <div className="relative w-[80%]">
                                <CiUnlock className="absolute left-2 top-1/2 -translate-y-1/2 text-green-500" />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirm"
                                    value={formdata.confirm}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="w-full pl-8 py-2 border-b border-gray-400 focus:outline-none"
                                    required
                                />
                                <span
                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                >
                                    {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </span>
                            </div>
                        )}

                        <div className="w-[80%]">
                            <button
                                type="submit"
                                className={`w-full ${loading ? 'bg-gray-500' : 'bg-blue-800'} text-white py-2 rounded-xl font-semibold transition-all duration-200 hover:bg-blue-700`}
                                disabled={loading}
                            >
                                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
                            </button>
                        </div>

                        <p className="text-sm text-gray-600">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                type="button"
                                className="text-blue-600 underline ml-1 hover:text-blue-800"
                                onClick={handleFormToggle}
                            >
                                {isSignUp ? "Login" : "Sign Up"}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
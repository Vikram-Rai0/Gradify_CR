import React, { useState } from 'react';
import { CiUser, CiVoicemail, CiUnlock } from "react-icons/ci";
import axios from "axios";

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [formdata, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm: '',
        role: 'Student'
    });
    const [loading, setLoading] = useState(false);

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
                if (formdata.password !== formdata.confirm) {
                    alert("Passwords do not match!");
                    setLoading(false);
                    return;
                }

                const res = await axios.post("http://localhost:5000/signup", {
                    username: formdata.username,
                    email: formdata.email,
                    password: formdata.password,
                    role: formdata.role
                });
                alert("Signup successful!");
                console.log(res.data);
            } else {
                const res = await axios.post("http://localhost:5000/login", {
                    email: formdata.email,
                    password: formdata.password
                });
                alert("Login successful!");
                console.log(res.data);
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
            <div className="flex rounded-xl w-[800px] h-[500px] bg-white shadow-lg overflow-hidden">

                {/* Background */}
                <div className="w-[45%] hidden md:block">
                    <img
                        src="/signupBackground.png"
                        alt="signup"
                        className="h-full w-full object-cover rounded-l-2xl"
                    />
                </div>

                {/* Form */}
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
                                        name="username"
                                        value={formdata.username}
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
                                        <option value="Instructor">Instructor</option>
                                        <option value="Teacher">Teacher</option>
                                        <option value="Student">Student</option>
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
                                type="password"
                                name="password"
                                value={formdata.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-8 py-2 border-b border-gray-400 focus:outline-none"
                                required
                            />
                        </div>

                        {isSignUp && (
                            <div className="relative w-[80%]">
                                <CiUnlock className="absolute left-2 top-1/2 -translate-y-1/2 text-green-500" />
                                <input
                                    type="password"
                                    name="confirm"
                                    value={formdata.confirm}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="w-full pl-8 py-2 border-b border-gray-400 focus:outline-none"
                                    required
                                />
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
                                onClick={() => setIsSignUp(!isSignUp)}
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

export default AuthForm;

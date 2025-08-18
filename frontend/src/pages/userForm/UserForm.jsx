import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CiUser, CiVoicemail, CiUnlock } from "react-icons/ci";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const UserForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signup");
  const [formdata, setFormData] = useState({
    name: "",
    role: "Student",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
        if (formdata.password.length < 6) {
          alert("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }

        await axios.post(
          "http://localhost:5000/api/user/signup",
          {
            name: formdata.name,
            email: formdata.email,
            password: formdata.password,
            role: formdata.role,
          },
          { withCredentials: true }
        );

        alert("Signup successful!");
        navigate("/login");
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/user/login",
          {
            email: formdata.email,
            password: formdata.password,
          },
          { withCredentials: true }
        );

        alert("Login successful!");
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleFormToggle = () => {
    navigate(isSignUp ? "/login" : "/signup");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="flex w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden backdrop-blur-lg">
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="../signupBackground.png"
            alt="form-bg"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900 bg-opacity-40 flex flex-col items-center justify-center text-white p-6">
            <h2 className="text-3xl font-bold tracking-wide">
              Welcome {isSignUp ? "to Our Platform" : "Back"}
            </h2>
            <p className="mt-3 text-sm text-blue-100 text-center max-w-xs">
              {isSignUp
                ? "Join our growing community of learners and educators."
                : "Sign in to continue your learning journey."}
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-8">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 animate-fadeIn"
          >
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              {isSignUp ? "Create an Account" : "Login to Your Account"}
            </h1>
            <p className="text-sm text-gray-500 text-center mb-2">
              {isSignUp
                ? "Please fill in the details to get started."
                : "Enter your credentials to access your account."}
            </p>

            {isSignUp && (
              <>
                <div className="relative">
                  <CiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-lg" />
                  <input
                    type="text"
                    name="name"
                    value={formdata.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    Role:
                  </label>
                  <select
                    name="role"
                    value={formdata.role}
                    onChange={handleChange}
                    className="w-full pl-16 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    required
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Instructor">Instructor</option>
                  </select>
                </div>
              </>
            )}

            <div className="relative">
              <CiVoicemail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-lg" />
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <CiUnlock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formdata.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600 transition"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {isSignUp && (
              <div className="relative">
                <CiUnlock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-lg" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm"
                  value={formdata.confirm}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  required
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600 transition"
                >
                  {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading
                ? "Processing..."
                : isSignUp
                  ? "Sign Up"
                  : "Login"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-3">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={handleFormToggle}
                className="ml-1 text-blue-600 hover:underline"
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

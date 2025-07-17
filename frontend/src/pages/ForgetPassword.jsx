import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleRequestOTP = async () => {
        try {
            await axios.post("http://localhost:5000/api/user/forgot-password", { email });
            alert("OTP sent to your email.");
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleResetPassword = async () => {
        try {
            await axios.post("http://localhost:5000/api/user/reset-password", {
                email,
                otp,
                newPassword,
            });
            alert("Password reset successful");
            window.location.href = "/"; // Redirect to login
        } catch (err) {
            alert(err.response?.data?.message || "Reset failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-[400px]">
                <h2 className="text-xl font-bold text-center mb-4">Forgot Password</h2>

                {step === 1 && (
                    <>
                        <input
                            type="email"
                            className="w-full border p-2 rounded mb-3"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className="w-full bg-blue-600 text-white py-2 rounded"
                            onClick={handleRequestOTP}
                        >
                            Send OTP
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <input
                            type="text"
                            className="w-full border p-2 rounded mb-3"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <input
                            type="password"
                            className="w-full border p-2 rounded mb-3"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            className="w-full bg-green-600 text-white py-2 rounded"
                            onClick={handleResetPassword}
                        >
                            Reset Password
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

import React, { useState } from 'react';
import axios from 'axios';

const JoinClass = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [message, setMessage] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/classroom/joinclass',
        { invite_code: inviteCode },
        { withCredentials: true } // ✅ Send cookie (JWT token)
      );

      setMessage(res.data.message);
      alert("Joined class successfully!");
      // Optionally navigate or refresh
      window.location.href = '/home';
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.error || "Failed to join class.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleJoin}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Join Classroom</h2>
        <input
          type="text"
          placeholder="Enter Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Join
        </button>
        {message && (
          <p className="mt-3 text-center text-sm text-red-500">{message}</p>
        )}
      </form>
    </div>
  );
};

export default JoinClass;

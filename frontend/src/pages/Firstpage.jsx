import React from 'react'
import { useNavigate } from 'react-router-dom'

const FirstPage = () => {
    const navigate = useNavigate();
    const handleChange = (e) => {
        const value = e.target.value;
        if (value) {
            navigate(`/${value}`);
        }
    };
    return (

        <select onChange={handleChange} defaultChecked="">
            <option value="login"><button>Login</button></option>
            <option value="signup">Signup</option>
        </select>

    )
}

export default FirstPage;
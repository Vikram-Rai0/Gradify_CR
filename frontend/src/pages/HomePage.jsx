import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate();
    const handleButtonClicked = (e) => {
        const value = e.target.value;
        if (value) {
            navigate(`/${value}`);
        }
    };  
    return (
        <div>
            {/* <button value={'login'} onClick={handleButtonClicked} className='border-2 rounded-md'>Login</button> */}
            <button value={'signup'} onClick={handleButtonClicked} className='border-2 rounded-md'>Signup</button>
        </div>

    )
}

export default HomePage;
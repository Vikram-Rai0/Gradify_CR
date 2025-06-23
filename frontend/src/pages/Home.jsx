import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const classId = "abc123"
    return (
        <Link to={`/class/${classId}`} >  <div className='h-50 w-50 border-2 border-red-600 '>
            click div
        </div></Link>

    )
}

export default Home

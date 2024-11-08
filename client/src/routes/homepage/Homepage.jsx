import { Link } from 'react-router-dom'
import './homepage.css'
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';

const Homepage = () => {
 
  return (
    <div className='homepage'>
      <img src="/orbital.png" alt="" className='orbital' />
      <div className="left">
        <h1>LAMA AI</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea laborum rerum voluptatem nesciunt porr.</h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className='imgContainer'>
          <div className="bgContainer">
            <div className="bg"> </div>
          </div>
          <img src="/bot.png" alt="" className='bot' />
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
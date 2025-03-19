import React from 'react';
import './aboutUs.css';

const developers = [
  {
    name: "Swarup",
    description: "FullStack",
    image: "/swarup.png"
  },
  {
    name: "Swatik",
    description: "Frontend",
    image: "/swatik.png"
  },
  {
    name: "Supratik",
    description: "Database Admin",
    image: "/supratik.png"
  },
  {
    name: "Subham",
    description: "Backend",
    image: "/malla.png"
  }
];

const AboutUs = () => {
  return (
    <div className="aboutUs">
      <h1>About Us</h1>
      <div className="developers">
        {developers.map((dev, index) => (
          <div key={index} className="developer">
            <img src={dev.image} alt={dev.name} className="developer-image" />
            <h2>{dev.name}</h2>
            <p>{dev.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
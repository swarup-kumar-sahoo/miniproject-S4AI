import React from 'react';
import './documentation.css';

const developers = [
  {
    name: "Developer 1",
    description: "Description for Developer 1.",
    image: "/path/to/developer1.jpg"
  },
  {
    name: "Developer 2",
    description: "Description for Developer 2.",
    image: "/path/to/developer2.jpg"
  },
  {
    name: "Developer 3",
    description: "Description for Developer 3.",
    image: "/path/to/developer3.jpg"
  },
  {
    name: "Developer 4",
    description: "Description for Developer 4.",
    image: "/path/to/developer4.jpg"
  }
];

const Documentation = () => {
  return (
    <div className="documentation">
      <h1>Website Documentation</h1>
      <section className="website-details">
        <h2>About This Website</h2>
        <p>
          This website is designed to provide users with AI-powered tools and features. 
          Users can generate images from text, analyze text, and more. The website is built 
          using modern web technologies and integrates with various AI APIs to deliver 
          powerful functionalities.
        </p>
      </section>
      <section className="developers">
        <h2>Meet the Developers</h2>
        <div className="developer-list">
          {developers.map((dev, index) => (
            <div key={index} className="developer">
              <img src={dev.image} alt={dev.name} className="developer-image" />
              <h3>{dev.name}</h3>
              <p>{dev.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Documentation;
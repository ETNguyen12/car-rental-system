import React from 'react';
import startImage from '../assets/start.png'; // Adjust the path if necessary

const StartImage = ({ height = '250px', width = '250px', alt = 'Start Image' }) => {
  return (
    <img
      src={startImage}
      alt={alt}
      style={{
        height: height,
        width: width,
      }}
    />
  );
};

export default StartImage;
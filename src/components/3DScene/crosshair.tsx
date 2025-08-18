import React from 'react';

const Crosshair: React.FC = () => {
  return (
    <>
      <div style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        right: '50%',
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '4.5px',
        aspectRatio: 1,
        zIndex: 1
      }}
      />
    </>
  );
};

export default Crosshair;
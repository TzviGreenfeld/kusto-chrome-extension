import React, { useRef, useEffect } from 'react';

const DOMManipulator = () => {
  const targetElement = useRef(null);

  useEffect(() => {
    if (targetElement.current) {
      targetElement.current.style.border = '2px solid red';
    }
  }, []);

  return (
    <div ref={targetElement}>
      <h1>This element will be styled!</h1>
    </div>
  );
};

export default DOMManipulator;

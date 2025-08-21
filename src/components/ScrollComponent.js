import React, { useRef, useEffect } from 'react';

function ScrollComponent() {
  const scrollableDiv = useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      scrollableDiv.current.scrollTop += e.deltaY * 0.2; // Adjust 0.2 to control speed
    };

    const divElement = scrollableDiv.current;
    divElement.addEventListener('wheel', handleScroll);

    return () => {
      divElement.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <div
      ref={scrollableDiv}
      style={{ height: '200px', overflowY: 'auto', border: '1px solid black' }}
    >
      <div style={{ height: '400px' }}>
        {Array.from({ length: 20 }, (_, i) => <p key={i}>Item {i + 1}</p>)}
      </div>
    </div>
  );
}

export default ScrollComponent;
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PageLayout = ({ children, showBackground = false, backgroundImage = null }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 relative">
        {showBackground && backgroundImage && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <img
              src={backgroundImage}
              alt="Background"
              className="w-[70vw] max-w-[400px] opacity-10"
            />
          </div>
        )}
        
        <div className={showBackground ? "relative z-10" : ""}>
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;
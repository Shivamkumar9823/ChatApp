import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Msgcontainer from "../../components/Msgcontainer";

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerStyle = {
    width: isMobile?"100%":"900px", // Full width on mobile, 900px on larger screens
    height: "100vh",
    display: "flex",
    borderRadius: isMobile ?"0px": "10px",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  };

  return (
    <div style={containerStyle}>
      <Sidebar />
      {!isMobile && <Msgcontainer />}
    </div>
  );
};

export default HomePage;

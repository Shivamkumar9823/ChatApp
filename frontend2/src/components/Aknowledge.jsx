import React, { useContext, useState } from "react";

const LoginPrompt = () => {
 const [isLoggedIn,setIsLoggedIn] = useState(false);
useContext(()=>{
      const _id = localStorage.getItem("_id"); 
      setIsLoggedIn(!!_id);
},[]);

  return (
    <>
      {!isLoggedIn && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p>You need to log in to access this feature.</p>
        </div>
      )}
    </>
  );
};

export default LoginPrompt;

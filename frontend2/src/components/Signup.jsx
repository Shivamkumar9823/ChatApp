import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import toast from "react-hot-toast";
import { setAuthUser } from "../redux/userSlice";

const Signup = () => {
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(()=>{
      console.log(user)
  })

  const handleGenderChange = (gender) => {
    setUser((prev) => ({
      ...prev,
      gender: gender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
   try {
    const res = await axios.post(`${API_URL}/api/v1/user/register`, user,
      {
          headers: {
              'Content-Type': 'application/json'
          },
          withCredentials: true
      }
  );
     if(res.data.success ){
         toast.success(res.data.messsage);
         localStorage.setItem("token",res.data.token);
         localStorage.setItem("_id",res.data._id);
         navigate('/');
     }
     console.log("server response : ", res);
   } catch (error) {
         toast.error(error.response.data.messsage)
         console.error("Error during signup:", error);
         alert("An error occurred while signing up. Please try again.");
   }

    // Process form data here (e.g., send it to the backend)
    setUser(
      {
        fullname: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "",
      }
    )
  };

  return (
    <div className="min-w-96 mx-auto">
      <div
        className="h-full w-full p-6 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-center text-gray-700">Signup</h1>
        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div>
            <label className="label p-4">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              className="w-full input input-bordered h-10"
              type="text"
              name="fullname"
              placeholder="Enter your full name"
              value={user.fullname}
              onChange={handleChange}
            />
          </div>
          {/* Username Input */}
          <div>
            <label className="label p-4">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              className="w-full input input-bordered h-10"
              type="text"
              name="username"
              placeholder="Enter Username"
              value={user.username}
              onChange={handleChange}
            />
          </div>
          {/* Password Input */}
          <div>
            <label className="label p-4">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              className="w-full input input-bordered h-10"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={user.password}
              onChange={handleChange}
            />
          </div>
          {/* Confirm Password Input */}
          <div>
            <label className="label p-4">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              className="w-full input input-bordered h-10"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {/* Gender Selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p>Male</p>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={user.gender === "male"}
                onChange={() => handleGenderChange("male")}
                className="radio mx-2"
              />
            </div>
            <div className="flex items-center">
              <p>Female</p>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={user.gender === "female"}
                onChange={() => handleGenderChange("female")}
                className="radio mx-2"
              />
            </div>
          </div>
          {/* Login Link */}
          <p className="mt-2">
            Already have an account? 
            <Link to="/login" className="text-blue-500 ml-1">Login</Link>
          </p>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="btn btn-block btn-sm mt-4 border-slate-700"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const API_URL = import.meta.env.VITE_API_URL;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({
          ...prev,
         [name]: value,
       }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/v1/user/login`, credentials, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      // console.log("login res.data: ",res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("_id", res.data._id);
        window.dispatchEvent(new Event("storage"));

        dispatch(setAuthUser(res.data));
        navigate('/'); 
      }
    }
    catch (error) {
          toast.error(error.response.data.message)
          console.error("Error during signup:", error);
    }
    setCredentials({
      username: '',
      password: '',
    })
  };

  return (
    <div className='min-w-96 mx-auto'>
      <div
        className='h-full w-full p-6 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'
      >
        <h1 className='text-3xl font-bold text-center text-grey-300'>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className='label p-4'>
              <span className='text-base label-text'>Username</span>
            </label>
            <input
              className='w-full input input-bordered h-10'
              type='text'
              name='username'
              placeholder='Enter Username'
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className='label p-4'>
              <span className='text-base label-text'>Password</span>
            </label>
            <input
              className='w-full input input-bordered h-10'
              type='password'
              name='password'
              placeholder='Enter Password'
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <p>Create New Account</p>
          <Link to='/register'> Signup</Link>
          <div>
            <button
              type='submit'
              className='btn btn-block btn-sm mt-2 border-slate-700'
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

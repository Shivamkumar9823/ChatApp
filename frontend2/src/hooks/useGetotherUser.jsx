import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setOtherUsers } from '../redux/userSlice';

const useGetotherUser = () => {
    const dispatch = useDispatch();
    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(()=>{
        const fetchOtherUsers = async () => {
            try {
                const token = localStorage.getItem("token");  // Ensure token is fetched
                if (!token) {
                    console.error("No token found in localStorage!");
                    return;
                }
        
                const res = await axios.get(`${API_URL}/api/v1/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
        
                console.log("otherUsers:", res.data); 
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.error("Error fetching users:", error.response?.data || error.message);
            }
        };
        
       fetchOtherUsers(); //calling same function;
    },[dispatch])

}

export default useGetotherUser;

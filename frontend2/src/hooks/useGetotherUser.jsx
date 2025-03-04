import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setOtherUsers } from '../redux/userSlice';

const useGetotherUser = () => {
    const dispatch = useDispatch();
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        const fetchOtherUsers = async ()=>{
            try {
                const res = await axios.get(`${API_URL}/api/v1/user`, {
                    withCredentials: true
                });                
                console.log("otherUsers : ",res);
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.log(error);
            }
        }
       fetchOtherUsers(); //calling same function;
    },[dispatch])

}

export default useGetotherUser;

import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setOtherUsers } from '../redux/userSlice';

const useGetotherUser = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchOtherUsers = async ()=>{
            try {
                axios.defaults.withCredentials = true;  // else user not authenticated shown; as is a protected api;
                const res = await axios.get('http://localhost:8080/api/v1/user');
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

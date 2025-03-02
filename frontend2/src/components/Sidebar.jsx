import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import useGetotherUser from '../hooks/useGetotherUser';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { setOtherUsers, setSelectedUser,setAuthUser } from '../redux/userSlice';

const Sidebar = () => {
   const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);


  useGetotherUser(); //fetching all other users;
  const { otherUsers } = useSelector(store => store.user); //importing otherUsers to use get data from it;
  if (!otherUsers) {
    return null;
  }


  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/user/logout');
      navigate("/login");
      dispatch(setAuthUser(null));
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };


  
  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
    setSelectedUserId(user._id); // Update the selected user state
  };

  const searchSubmitHandler = (e)=>{
      e.preventDefault();
      const targetUser = otherUsers?.find((user)=> user.fullname.toLowerCase().includes(search.toLocaleLowerCase()));
      if(targetUser){
        dispatch(setOtherUsers([targetUser]));
      }
      else{
        alert("not found!");
      }

  }



  return (
    <div className="w-70 bg-gray-900 text-white p-5 flex flex-col h-full">
      <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2 mb-4'>
        <input
              className='input input-bordered rounded-md flex-1'
              type="text" 
              placeholder='Search...'
              value={search}
              onChange={(e)=>setSearch(e.target.value)} />
        <button type='submit' className='btn bg-sky-500'>
          <FaSearch className='w-6 h-6 outline-none' />
        </button>
      </form>

{/* =========================================== other users ============================================================*/}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <ul>
          {otherUsers.map((user) => (
            <li
              onClick={() => selectedUserHandler(user)}
              key={user._id}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer 
                ${selectedUserId === user._id ? 'bg-white text-gray-900' : 'hover:bg-gray-800'}`}
            >
              <img
                src={user.profilephoto}
                alt={user.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-lg">{user.fullname}</span>
            </li>
          ))}
        </ul>
      </div>


      {/* =========================logout button =============================================================== */}
      <div className='mt-auto'>
        <button onClick={logoutHandler} className='w-full btn bg-sky-500 hover:bg-sky-600 text-white'>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
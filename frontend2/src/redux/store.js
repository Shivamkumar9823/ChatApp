import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice.js"  // for handling user state
import socketReducer from "./socketSlice.js"
import messageReducer from "./messagesSlice.js"
const store = configureStore({
    reducer:{
       user: userReducer,
       message: messageReducer,
       socket:socketReducer
    }
})

export default store;
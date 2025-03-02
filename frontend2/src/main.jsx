import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import {Provider} from 'react-redux'
import store from './redux/store'
import { SocketProvider } from "./storeContext/SocketContext.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
    <SocketProvider>
       <App />
       <Toaster />
    </SocketProvider>
    </Provider>
  </BrowserRouter>
)

// src/AppLayout.jsx
import React from 'react';
import { Provider } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import { Banner } from './Constant/imageConstant';
import store from './Pages/Redux/store';
const AppLayout = () => {
  const location = useLocation()
  return (
    <Provider store={store}>
    <div style={{height:'100vh',width:'100vw'}}>
            <ToastContainer />

      <Header />
      <img src={Banner} style={{width:'100%',height:'150px',objectFit:'cover',marginTop:'50px'}}/>
      <Outlet />
    <Footer/>
    </div>
    </Provider>
  );
};

export default AppLayout;

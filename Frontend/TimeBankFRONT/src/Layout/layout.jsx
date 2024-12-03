import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../Sidebar/sidebar';
import './Layout.css';
import Header from '../Header/header';
import Footer from '../Footer/Footer';

const Layout = () => {
  return (
    <div className="layout-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <Outlet /> 
        </div>
      </div>
      <Footer /> 
    </div>
  );
};

export default Layout;

import React, { Suspense, lazy } from 'react';
import HeaderComponent from './Component/Header/HeaderComponent';
import FooterComponent from './Component/Footer/FooterComponent';
import "./App.css";

import { Routes, Route } from 'react-router-dom';
// import Login from './Component/Login/Login';
// import SelectOption from './Component/SelectPort/SelectOption';

import Dashboard from './Component/dashboard/Dashboard';
import Dashboard2 from './Component/dashboard2/Dashboard2';
import SidebarComponent from './Component/Sidebar/SidebarComponent';
import CustomerList from './Component/Customer/CustomerList';
import UserReportComponent from './Component/Reports/GetUserReports';

// const Dashboard = lazy(() => import('./Component/dashboard/Dashboard'));
// const Dashboard2 = lazy(() => import('./Component/dashboard2/Dashboard2'));
// const SidebarComponent = lazy(() => import('./Component/Sidebar/SidebarComponent'));
// const CustomerList = lazy(() => import('./Component/Customer/CustomerList'));
// const UserReportComponent = lazy(() => import('./Component/Reports/GetUserReports'));

const App: React.FC = () => {


  return (
    <>

      <HeaderComponent />
      <div className='after-header'>
        <SidebarComponent />
        
        <section className='middle--container'>
        
          <Routes>
            <Route path="/contracts" element={<Dashboard />} />
            <Route path="/dashboard2" element={<Dashboard2 />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/report" element={<UserReportComponent />} />
          </Routes>
          
        </section>
        
      </div>
      <FooterComponent />
    </>
  );
};

export default App;

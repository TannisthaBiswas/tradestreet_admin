import React from "react";
import "./CSS/Admin.css";
import Sidebar from "../Components/Sidebar/Sidebar";
import AddProduct from "../Components/AddProduct/AddProduct";
import { Route, Routes } from "react-router-dom";
import ListProduct from "../Components/ListProduct/ListProduct";
import OrderStatus from "../Components/OrderStatus/OrderStatus";
import Dashboard from "../Components/Dashboard/dashboard";

const Admin = () => {

  return (
    <div className="admin">
      <Sidebar />
      <Routes>
      <Route path="/" element={<Dashboard />} /> 
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/orderstatus" element={<OrderStatus/>}/>
      </Routes>     
    </div>
  );
};

export default Admin;

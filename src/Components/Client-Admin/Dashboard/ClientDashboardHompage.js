import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Routes, Route, Outlet } from "react-router-dom";
import ClientSidebar from "../ClinetSidebar";
import ClientDashboardpage from "./ClientDashboardpage";
import ProductTable from "../Products/ProductTable";
import OrderList from "../Orders/OrderList";
import Notificationbar from "./Notificationbar";
import ProductDetials from "../Products/ProductDetials";
import OrdersDetail from "../Orders/OrdersDetail";
import InventoryList from "../Inventory/InventoryList";
import MainSettings from "../Settings/MainSettings";
import CustomOrderList from "../Orders/CustomOrderList";
import UserList from "../UserFeild/UserList";
import UserDetail from "../UserFeild/UserDetial";
import MyProductDetial from '../Dashboard/MyProducts/ProductsLoading/MyProductDetial';
import SalesProductDetailPage from "../Sales/SalesProductDetialPage/SalesProductDetail";

const ClientDashboardHomepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh",
      flexDirection: isMobile ? "column" : "row",
    }}>
      
      {/* Desktop Sidebar */}
      {!isMobile && <ClientSidebar />}

      {/* Main Content */}
      <Box sx={{ 
        flex: 1,
        p: { xs: 2, sm: 3 },
        overflow: "auto",
        mb: isMobile ? '70px' : 0,
        minHeight: isMobile ? "calc(100vh - 70px)" : "100vh",
      }}>
        <Notificationbar />
        
        <Routes>
          <Route path="/" element={<ClientDashboardpage />} />
          <Route path="products" element={<ProductTable />} />
          <Route path="products/details/:id" element={<ProductDetials />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/userdetails/:id" element={<UserDetail/>} />
          <Route path="orders/customList/:id" element={<CustomOrderList />} />
          <Route path="orders/details/:id" element={<OrdersDetail />} />
          <Route path="contact" element={<InventoryList />} />
          <Route path="settings" element={<MainSettings />} />
          <Route path="/product-detail/:id" element={<MyProductDetial />} />
          <Route path="/sales-detail/:id" element={<SalesProductDetailPage />} />
        </Routes>

        <Outlet />
      </Box>

      {/* Mobile Sidebar */}
      {isMobile && <ClientSidebar />}
    </Box>
  );
};

export default ClientDashboardHomepage;
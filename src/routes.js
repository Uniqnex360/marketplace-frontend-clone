// src\routes.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientDashboardHomepage from "./Components/Client-Admin/Dashboard/ClientDashboardHompage";

import LoginPage from "./Components/MarketLogin/LoginPage";
import PrivateRoute from "./Components/MarketLogin/PrivateRoute";
import Register from "./Components/MarketLogin/Register";
import { MarketplaceProvider } from "./utils/MarketplaceProvider";

import PrivacyPolicyPage from "./pages/privacy-policy.tsx";
import AccountDeletionPage from "./pages/AccountDeletion.tsx";

const AppRoutes = () => {
  return (
    <Router>
      {/* <Layout> */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/account-deletion" element={<AccountDeletionPage />} />
        <Route
          path="/Home/*"
          element={
            <PrivateRoute allowedRoles={["Manager"]}>
              <MarketplaceProvider
                userId={JSON.parse(localStorage.getItem("user"))?.id}
              >
                <ClientDashboardHomepage />
              </MarketplaceProvider>
            </PrivateRoute>
          }
        />
      </Routes>
      {/* </Layout> */}
    </Router>
  );
};

export default AppRoutes;

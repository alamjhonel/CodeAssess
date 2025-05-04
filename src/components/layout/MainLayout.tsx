import React from "react";
import AuthWrapper from "../auth/AuthWrapper";
import Layout from "./Layout";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthWrapper>
      <Layout>{children}</Layout>
    </AuthWrapper>
  );
};

export default MainLayout;

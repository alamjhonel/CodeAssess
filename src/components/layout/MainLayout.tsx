
import React from "react";
import AuthWrapper from "../auth/AuthWrapper";
import Layout from "./Layout";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <AuthWrapper>
      <Layout>{children}</Layout>
    </AuthWrapper>
  );
};

export default MainLayout;

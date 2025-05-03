
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransition from "../animations/PageTransition";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20">
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Layout;

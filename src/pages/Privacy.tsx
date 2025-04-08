
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/animations/PageTransition";
import { Shield } from "lucide-react";

const Privacy: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8 text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-high-contrast mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="space-y-8 text-high-contrast">
            <section>
              <h2 className="text-xl font-semibold mb-3">Introduction</h2>
              <p className="text-muted-foreground">
                CodeGrade ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by CodeGrade. This Privacy Policy applies to our website, and its associated subdomains (collectively, our "Service").
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
              <p className="text-muted-foreground mb-3">
                We collect information to provide better services to all our users. The types of information we collect include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information: When you create an account, we collect your name, email address, password, and profile information.</li>
                <li>Usage data: We collect information about how you use our service, such as the pages you visit, the time and duration of your visits, and the code submissions you make.</li>
                <li>Code submissions: When you submit code for assessment, we store the code and related assessment data.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-3">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide and maintain our Service</li>
                <li>To assess and evaluate code submissions</li>
                <li>To improve our Service and develop new features</li>
                <li>To communicate with you, including sending notifications about your assessments</li>
                <li>To prevent fraud and enhance the security of our Service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at support@codegrade.edu.
              </p>
            </section>
          </div>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Privacy;

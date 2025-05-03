
import React from "react";
import { Github, Linkedin, Code2, CheckCircle, FileText, Shield, Mail } from "lucide-react";
import CodeGradeLogo from "../brand/CodeGradeLogo";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          <div className="flex flex-col items-center">
            <CodeGradeLogo size="md" />
            <div className="flex flex-col items-center mt-2">
              <p className="text-sm text-high-contrast mt-2">
                © {new Date().getFullYear()} CodeGrade. All rights reserved.
              </p>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                <span>Secured with SSL encryption</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center md:items-start">
              <h5 className="font-medium mb-3 text-high-contrast">References</h5>
              <div className="flex space-x-5">
                <a 
                  href="https://github.com/codegrade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-high-contrast transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/codegrade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-high-contrast transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://leetcode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-high-contrast transition-colors"
                  aria-label="LeetCode"
                >
                  <Code2 className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h5 className="font-medium mb-3 text-high-contrast">Quick Links</h5>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-high-contrast transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-muted-foreground hover:text-high-contrast transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/login?tab=sign-up" className="text-sm text-muted-foreground hover:text-high-contrast transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h5 className="font-medium mb-3 text-high-contrast">Legal & Help</h5>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-muted-foreground hover:text-high-contrast transition-colors flex items-center">
                    <Shield className="h-4 w-4 mr-1.5" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-sm text-muted-foreground hover:text-high-contrast transition-colors flex items-center">
                    <FileText className="h-4 w-4 mr-1.5" />
                    Documentation
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@codegrade.edu" className="text-sm text-muted-foreground hover:text-high-contrast transition-colors flex items-center">
                    <Mail className="h-4 w-4 mr-1.5" />
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

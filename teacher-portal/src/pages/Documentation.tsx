
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/animations/PageTransition";
import { FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Documentation: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
          <div className="mb-8 text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-high-contrast mb-2">Documentation</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides and documentation for using the CodeGrade platform with fuzzy logic assessment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-high-contrast">Getting Started</h2>
              <p className="text-muted-foreground mb-4">
                Learn the basics of using CodeGrade for code assessment, from creating an account to submitting your first code.
              </p>
              <Link to="/docs/getting-started" className="text-primary flex items-center text-sm font-medium">
                Read guide <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-high-contrast">For Students</h2>
              <p className="text-muted-foreground mb-4">
                Discover how to submit assignments, view feedback, and improve your code based on assessment results.
              </p>
              <Link to="/docs/for-students" className="text-primary flex items-center text-sm font-medium">
                Read guide <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-high-contrast">For Teachers</h2>
              <p className="text-muted-foreground mb-4">
                Learn how to create assignments, set up rubrics, and use fuzzy logic to assess student submissions.
              </p>
              <Link to="/docs/for-teachers" className="text-primary flex items-center text-sm font-medium">
                Read guide <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-high-contrast">Fuzzy Logic Explained</h2>
              <p className="text-muted-foreground mb-4">
                Understand the fuzzy logic assessment system and how it provides fair and accurate evaluation of code.
              </p>
              <Link to="/docs/fuzzy-logic" className="text-primary flex items-center text-sm font-medium">
                Read guide <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-high-contrast">API Reference</h2>
              <p className="text-muted-foreground mb-4">
                Detailed documentation on our API endpoints for integration with other systems and tools.
              </p>
              <Link to="/docs/api-reference" className="text-primary flex items-center text-sm font-medium">
                Read guide <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3 text-high-contrast">FAQs</h2>
              <p className="text-muted-foreground mb-4">
                Find answers to frequently asked questions about using the CodeGrade platform and troubleshooting common issues.
              </p>
              <Link to="/docs/faqs" className="text-primary flex items-center text-sm font-medium">
                Read guide <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Documentation;

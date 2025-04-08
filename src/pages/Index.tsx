import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Code, LineChart, ShieldCheck, Terminal, Play, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FadeIn from "@/components/animations/FadeIn";
import TextGradient from "@/components/animations/TextGradient";
import GlassCard from "@/components/ui/custom/GlassCard";
import PageTransition from "@/components/animations/PageTransition";
import { useAuth } from "@/contexts/auth";

const CodeSnippet = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-black">
      <div className="flex items-center justify-start p-3 bg-muted/10 border-b border-border">
        <div className="flex space-x-2 items-center">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          <p className="text-xs font-mono text-muted-foreground">code-assessment.py</p>
        </div>
      </div>
      <div className="p-4 font-mono text-sm overflow-hidden text-left">
        <div className="animate-typing">
          <div className="flex items-center mb-3">
            <span className="text-green-400">def</span>
            <span className="text-blue-400 ml-2">assess_code</span>
            <span className="text-white">(code, rubric):</span>
          </div>
          <div className="flex items-start ml-4 mb-3">
            <span className="text-purple-400">"""</span>
            <div className="ml-2">
              <span className="text-purple-400">Assess code using fuzzy logic based on a rubric.</span>
              <div className="text-purple-400 mt-1">Returns a score and feedback dictionary.</div>
            </div>
            <span className="text-purple-400 ml-2">"""</span>
          </div>
          <div className="ml-4 mb-3">
            <span className="text-white">score = 0</span>
          </div>
          <div className="ml-4 mb-3">
            <span className="text-white">feedback = {}</span>
          </div>
          <div className="ml-4 mb-3">
            <span className="text-green-400">for</span>
            <span className="text-white ml-2">criterion</span>
            <span className="text-green-400 ml-2">in</span>
            <span className="text-white ml-2">rubric:</span>
          </div>
          <div className="ml-8 mb-3">
            <span className="text-white">criterion_score = fuzzy_evaluate(code, criterion)</span>
          </div>
          <div className="ml-8 mb-3">
            <span className="text-white">score += criterion_score * criterion['weight']</span>
          </div>
          <div className="ml-8 mb-3">
            <span className="text-white">feedback[criterion['name']] = generate_feedback(criterion_score)</span>
          </div>
          <div className="ml-4 mb-3">
            <span className="text-green-400">return</span>
            <span className="text-white ml-2">score, feedback</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-center mb-2">
        <div className="bg-primary/20 rounded-lg flex items-center px-3 py-1">
          <Terminal className="h-3 w-3 mr-1 text-primary" />
          <span className="text-xs font-medium">Live Demo</span>
          <Play className="h-3 w-3 ml-1 text-primary" />
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn direction="up" duration={800}>
                <div className="space-y-6">
                  <div className="inline-block">
                    <span className="bg-primary/10 text-primary text-xs font-medium py-1 px-3 rounded-full">
                      Technological University of the Philippines
                    </span>
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    Code Assessment using{" "}
                    <TextGradient className="font-display">
                      Rubric-based Fuzzy Logic
                    </TextGradient>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    A sophisticated platform for evaluating programming assignments using
                    rubric-based fuzzy logic, providing fair and accurate assessments for
                    your code.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {user ? (
                      <Link to="/dashboard">
                        <Button size="lg" className="rounded-full w-full sm:w-auto">
                          Go to Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link to="/login">
                          <Button size="lg" className="rounded-full w-full sm:w-auto">
                            Get Started <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to="/about">
                          <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                            Learn More
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn direction="up" duration={800} delay={200}>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur-xl opacity-70"></div>
                  <CodeSnippet />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-6 md:px-12 bg-secondary/30 dark:bg-secondary/10">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  <TextGradient>Advanced Features</TextGradient> for Code Assessment
                </h2>
                <p className="text-muted-foreground">
                  Our platform offers powerful tools for both students and teachers to streamline 
                  the code assessment process with precision and ease.
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn direction="up" delay={100}>
                <GlassCard className="p-6 h-full">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-medium mb-3">
                    Comprehensive Code Analysis
                  </h3>
                  <p className="text-muted-foreground">
                    Upload and evaluate C, C++, and Python code with detailed 
                    rubric-based assessment using fuzzy logic evaluation.
                  </p>
                </GlassCard>
              </FadeIn>
              
              <FadeIn direction="up" delay={200}>
                <GlassCard className="p-6 h-full">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-medium mb-3">
                    Advanced Analytics
                  </h3>
                  <p className="text-muted-foreground">
                    Gain insights with comprehensive performance analytics and visualizations.
                    Track student progress and identify areas for improvement.
                  </p>
                </GlassCard>
              </FadeIn>
              
              <FadeIn direction="up" delay={300}>
                <GlassCard className="p-6 h-full">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-medium mb-3">
                    Secure Role-Based Access
                  </h3>
                  <p className="text-muted-foreground">
                    Custom permissions for teachers and students with secure authentication
                    and comprehensive administrative controls.
                  </p>
                </GlassCard>
              </FadeIn>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  How It <TextGradient>Works</TextGradient>
                </h2>
                <p className="text-muted-foreground">
                  Our streamlined process makes code assessment simple and efficient
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              
              <FadeIn direction="up" delay={100}>
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 z-10">
                    1
                  </div>
                  <h3 className="font-display text-xl font-medium mb-3">
                    Submit Code
                  </h3>
                  <p className="text-muted-foreground">
                    Upload your C, C++, or Python code through our intuitive interface
                    or directly paste your code.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn direction="up" delay={200}>
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 z-10">
                    2
                  </div>
                  <h3 className="font-display text-xl font-medium mb-3">
                    Automated Evaluation
                  </h3>
                  <p className="text-muted-foreground">
                    Our platform analyzes your code using rubric-based criteria and
                    applies fuzzy logic for fair assessment.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn direction="up" delay={300}>
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 z-10">
                    3
                  </div>
                  <h3 className="font-display text-xl font-medium mb-3">
                    Receive Detailed Results
                  </h3>
                  <p className="text-muted-foreground">
                    Get comprehensive feedback with numerical scores, fuzzy scores, and
                    detailed improvement suggestions.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
        
        {/* CTA Section - Only show for non-logged in users */}
        {!user && (
          <section className="py-20 px-6 md:px-12 bg-secondary/30 dark:bg-secondary/10">
            <div className="max-w-4xl mx-auto">
              <FadeIn>
                <GlassCard intensity="high" className="p-8 md:p-12">
                  <div className="text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                      Ready to get <TextGradient>started?</TextGradient>
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                      Join the TUP coding assessment platform and experience fair, accurate
                      code evaluations with our advanced rubric-based system.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/login">
                        <Button size="lg" className="rounded-full w-full sm:w-auto">
                          Sign In <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to="/login?tab=sign-up">
                        <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </FadeIn>
            </div>
          </section>
        )}
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;

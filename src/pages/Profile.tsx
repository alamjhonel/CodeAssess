
import React from "react";
import { useAuth } from "@/contexts/auth";
import MainLayout from "@/components/layout/MainLayout";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clipboard, Download, Eye, Mail, School, User, Calendar, IdCard } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import FadeIn from "@/components/animations/FadeIn";

const Profile = () => {
  const { user, profile, isLoading } = useAuth();

  const getInitials = () => {
    if (profile) {
      return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto mt-8 p-4">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid gap-8 md:grid-cols-3">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 md:col-span-2" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <FadeIn>
        <div className="container mx-auto mt-8 p-4">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
          {user && profile ? (
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">{profile.first_name} {profile.last_name}</CardTitle>
                  <CardDescription>
                    <Badge variant={profile.role === "teacher" ? "default" : "secondary"} className="capitalize">
                      {profile.role}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <IdCard className="h-4 w-4 mr-2 opacity-70" />
                      TUP ID
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{profile.tup_id || 'Not set'}</span>
                      {profile.tup_id && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => copyToClipboard(profile.tup_id || '', 'TUP ID')}
                        >
                          <Clipboard className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Mail className="h-4 w-4 mr-2 opacity-70" />
                      Email
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{user.email}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => copyToClipboard(user.email || '', 'Email')}
                      >
                        <Clipboard className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2 opacity-70" />
                      Birthdate
                    </span>
                    <span className="font-medium">
                      {profile.birthdate ? format(new Date(profile.birthdate), 'MMMM d, yyyy') : 'Not set'}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    <Eye className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{profile.role === "teacher" ? "Teaching Information" : "Student Information"}</CardTitle>
                  <CardDescription>Your academic details and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.role === "teacher" ? (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <School className="mr-2 h-4 w-4 text-primary" />
                          Teaching Specializations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Programming Fundamentals</Badge>
                          <Badge variant="outline">Data Structures</Badge>
                          <Badge variant="outline">Algorithms</Badge>
                          <Badge variant="outline">Database Systems</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <User className="mr-2 h-4 w-4 text-primary" />
                          Faculty Status
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Full-time Faculty Member, College of Computer Studies
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <School className="mr-2 h-4 w-4 text-primary" />
                          Academic Program
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Bachelor of Science in Computer Science
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-primary" />
                          Academic Status
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          3rd Year, 2nd Semester
                        </p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <IdCard className="mr-2 h-4 w-4 text-primary" />
                      Account Created
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(profile.created_at), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> 
                    Download Academic Record
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <Card className="p-8">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2">Could not load profile information</h2>
                <p className="text-muted-foreground mb-4">
                  Please try refreshing the page or contact support
                </p>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </Card>
          )}
        </div>
      </FadeIn>
    </MainLayout>
  );
};

export default Profile;

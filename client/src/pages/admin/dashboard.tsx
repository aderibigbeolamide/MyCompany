import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, FileText, Users, BarChart3, Settings, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, logout, isLoading } = useAuth();

  useEffect(() => {
    console.log('Dashboard auth check:', { isAuthenticated, isAdmin, isLoading });
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      console.log('Redirecting to login');
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, isAdmin, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <div>Redirecting to login...</div>;
  }

  const stats = [
    { title: "Total Blog Posts", value: "12", icon: <FileText className="h-8 w-8 text-primary" />, color: "text-primary" },
    { title: "Form Submissions", value: "48", icon: <Users className="h-8 w-8 text-accent" />, color: "text-accent" },
    { title: "Active Forms", value: "5", icon: <BarChart3 className="h-8 w-8 text-secondary" />, color: "text-secondary" },
    { title: "Contact Inquiries", value: "23", icon: <Settings className="h-8 w-8 text-primary" />, color: "text-primary" }
  ];

  const quickActions = [
    { title: "Create Blog Post", description: "Write and publish new blog content", href: "/admin/blog/new", icon: <PenTool className="h-6 w-6" />, color: "bg-primary" },
    { title: "Create Form", description: "Build dynamic forms for courses, hiring, events", href: "/admin/forms/new", icon: <Plus className="h-6 w-6" />, color: "bg-accent" },
    { title: "Manage Blog", description: "Edit and manage existing blog posts", href: "/admin/blog", icon: <FileText className="h-6 w-6" />, color: "bg-secondary" },
    { title: "View Submissions", description: "Review form submissions and inquiries", href: "/admin/submissions", icon: <Users className="h-6 w-6" />, color: "bg-primary" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary font-space">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your TechNurture content and forms</p>
            </div>
            <div className="flex space-x-2">
              <Link href="/">
                <Button variant="outline">Back to Website</Button>
              </Link>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-6 font-space">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 ${action.color} text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold text-secondary group-hover:text-primary transition-colors">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-secondary font-space">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-secondary">New contact form submission</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-secondary">Blog post published</p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-secondary">New course enrollment</p>
                    <p className="text-sm text-gray-600">3 days ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
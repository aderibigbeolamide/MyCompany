import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, ArrowLeft, FileText, Phone, Mail, MessageSquare } from "lucide-react";
import type { Contact, Enrollment, FormSubmission } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function AdminSubmissions() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, isAdmin, isLoading]);

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: formSubmissions = [], isLoading: submissionsLoading } = useQuery<FormSubmission[]>({
    queryKey: ["/api/submissions"],
    enabled: isAuthenticated && isAdmin,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || contactsLoading || enrollmentsLoading || submissionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-secondary font-space">Submissions Management</h1>
                <p className="text-gray-600 mt-1">View and manage all form submissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Input
              placeholder="Search submissions by name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4"
            />
          </div>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contacts">
              Contact Inquiries ({contacts.length})
            </TabsTrigger>
            <TabsTrigger value="enrollments">
              Academy Enrollments ({enrollments.length})
            </TabsTrigger>
            <TabsTrigger value="forms">
              Form Submissions ({formSubmissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            {filteredContacts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary mb-2">No contact inquiries found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? "Try adjusting your search" : "Contact submissions will appear here"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredContacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{contact.name}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {contact.service && (
                            <Badge variant="outline" className="mb-2">
                              {contact.service}
                            </Badge>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(contact.createdAt?.toString() || new Date().toISOString())}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{contact.message}</p>
                      {contact.newsletter === 1 && (
                        <Badge variant="secondary" className="mt-2">
                          Newsletter Subscribed
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-4">
            {filteredEnrollments.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary mb-2">No enrollments found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? "Try adjusting your search" : "Academy enrollments will appear here"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredEnrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{enrollment.name}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {enrollment.email}
                            </div>
                            {enrollment.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {enrollment.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="mb-2">
                            {enrollment.course}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(enrollment.createdAt?.toString() || new Date().toISOString())}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {enrollment.experience && (
                        <div className="mb-2">
                          <span className="font-medium text-sm">Experience: </span>
                          <span className="text-gray-700">{enrollment.experience}</span>
                        </div>
                      )}
                      {enrollment.motivation && (
                        <div>
                          <span className="font-medium text-sm">Motivation: </span>
                          <p className="text-gray-700 mt-1">{enrollment.motivation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            {formSubmissions.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary mb-2">No form submissions found</h3>
                    <p className="text-gray-600">Dynamic form submissions will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {formSubmissions.map((submission) => (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Form #{submission.formId}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(submission.createdAt?.toString() || new Date().toISOString())}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                        {JSON.stringify(JSON.parse(submission.submissionData), null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
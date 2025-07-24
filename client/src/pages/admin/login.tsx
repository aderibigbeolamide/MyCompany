import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  username: z.string()
    .min(1, "Username is required")
    .transform(val => val.trim())
    .refine(val => val.length > 0, "Username cannot be empty"),
  password: z.string()
    .min(1, "Password is required")
    .transform(val => val.trim())
    .refine(val => val.length > 0, "Password cannot be empty"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      console.log('Login success data:', data);
      if (data.success && data.user?.role === 'admin' && data.tokens) {
        // Store tokens for future requests
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        
        // Invalidate auth query to refresh authentication state
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        });
        console.log('Redirecting to dashboard');
        setLocation("/admin/dashboard");
      } else if (data.success && data.user?.role !== 'admin') {
        toast({
          title: "Access denied",
          description: "Admin access required",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Ensure data is trimmed before sending to server
    const trimmedData = {
      username: data.username.trim(),
      password: data.password.trim()
    };
    loginMutation.mutate(trimmedData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header with back to home link */}
      <div className="max-w-md mx-auto mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center text-gray-600 hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your username" 
                        {...field}
                        disabled={loginMutation.isPending}
                        onChange={(e) => {
                          // Automatically trim whitespace as user types
                          const trimmedValue = e.target.value.replace(/^\s+|\s+$/g, '');
                          field.onChange(trimmedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field}
                        disabled={loginMutation.isPending}
                        onChange={(e) => {
                          // Automatically trim whitespace as user types
                          const trimmedValue = e.target.value.replace(/^\s+|\s+$/g, '');
                          field.onChange(trimmedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        
        if (response.status === 401) {
          console.log('Not authenticated');
          return { success: false, message: "Not authenticated" };
        }
        
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Auth response:', result);
        return result;
      } catch (error) {
        console.log('Auth error:', error);
        return { success: false, message: "Auth error" };
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/admin/login");
    },
  });

  const isAuthenticated = !!user?.success && !!user?.user;
  const isAdmin = isAuthenticated && user?.user?.role === 'admin';

  return {
    user: user?.user || null,
    isLoading,
    isAuthenticated,
    isAdmin,
    logout: () => logoutMutation.mutate(),
  };
}
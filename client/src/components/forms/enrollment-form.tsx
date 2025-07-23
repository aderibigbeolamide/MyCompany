import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertEnrollmentSchema } from "@shared/schema";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const enrollmentFormSchema = insertEnrollmentSchema.extend({
  phone: z.string().optional().nullable(),
  experience: z.string().optional().nullable(),
  motivation: z.string().optional().nullable(),
});

type EnrollmentFormData = z.infer<typeof enrollmentFormSchema>;

interface EnrollmentFormProps {
  course: string;
}

export default function EnrollmentForm({ course }: EnrollmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      course: course,
      experience: "",
      motivation: "",
    },
  });

  const enrollmentMutation = useMutation({
    mutationFn: async (data: EnrollmentFormData) => {
      const response = await apiRequest("POST", "/api/enrollment", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Enrollment Submitted Successfully!",
        description: "Thank you for your interest! Our admissions team will contact you within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
    },
    onError: (error) => {
      toast({
        title: "Error Submitting Enrollment",
        description: "There was a problem submitting your enrollment. Please try again.",
        variant: "destructive",
      });
      console.error("Enrollment form error:", error);
    },
  });

  const onSubmit = (data: EnrollmentFormData) => {
    const submitData = {
      ...data,
      phone: data.phone || null,
      experience: data.experience || null,
      motivation: data.motivation || null,
    };
    enrollmentMutation.mutate(submitData);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-secondary mb-2">
          Enroll in {course}
        </DialogTitle>
        <p className="text-gray-600 mb-6">
          Fill out the form below to apply for this program. Our admissions team will review your application and get back to you soon.
        </p>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course *</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-gray-50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why do you want to take this course?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your goals and what you hope to achieve..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 border-t">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-blue-700 text-white py-3 px-6 text-lg font-semibold transition-all duration-200"
              disabled={enrollmentMutation.isPending}
            >
              {enrollmentMutation.isPending ? "Submitting..." : "Submit Enrollment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

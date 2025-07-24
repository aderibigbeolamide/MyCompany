import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@shared/schema";

const contactFormSchema = insertContactSchema.extend({
  newsletter: z.boolean().default(false),
  phone: z.string().optional().nullable(),
  service: z.string().optional().nullable(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
      newsletter: false,
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: (error) => {
      toast({
        title: "Error Sending Message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
      console.error("Contact form error:", error);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    const submitData = {
      ...data,
      phone: data.phone || null,
      service: data.service || null,
    };
    contactMutation.mutate(submitData);
  };

  return (
    <Form {...form}>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          <strong>Quick tip:</strong> The more details you share about your goals, the better we can help you. Don't worry about being too technical - just describe what you want to achieve!
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">What should we call you? *</FormLabel>
                <FormControl>
                  <Input placeholder="Your name or business name" {...field} className="text-lg py-3" />
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
                <FormLabel className="text-base font-medium">How can we reach you? *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} className="text-lg py-3" />
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
                <FormLabel className="text-base font-medium">Phone number (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="For faster response if urgent" {...field} value={field.value || ""} className="text-lg py-3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">What are you interested in?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="text-lg py-3">
                      <SelectValue placeholder="Choose what best fits your needs" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="web-development">🌐 Website or Web App</SelectItem>
                    <SelectItem value="ai-integration">🤖 AI & Automation Solutions</SelectItem>
                    <SelectItem value="automation">⚡ Business Process Automation</SelectItem>
                    <SelectItem value="academy">📚 Learning & Training Programs</SelectItem>
                    <SelectItem value="consultation">💬 Just Want to Chat About Ideas</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Tell us about your project or goals *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Examples:
• I need a website for my restaurant business
• I want to learn coding to change careers  
• I have an app idea but don't know where to start
• I want to automate my business processes

Don't worry about technical details - just describe what you want to achieve!"
                  className="resize-none text-lg min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  📧 Send me helpful tech tips and updates (you can unsubscribe anytime)
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
          <p className="text-green-800 text-sm">
            <strong>What happens next?</strong> We'll review your message and get back to you within 24 hours with next steps or answers to your questions.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-blue-700 text-white py-4 px-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          disabled={contactMutation.isPending}
        >
          {contactMutation.isPending ? "Sending Your Message..." : "Send Message & Get Started"}
        </Button>
      </form>
    </Form>
  );
}

import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { insertDynamicFormSchema, type DynamicForm, type InsertDynamicForm } from "@shared/schema";
import { z } from "zod";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

const formFieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

const formBuilderSchema = insertDynamicFormSchema.extend({
  fieldsData: z.array(formFieldSchema),
});

type FormBuilderData = z.infer<typeof formBuilderSchema>;

export default function FormBuilder() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isEditing = params.id !== undefined;
  const formId = params.id ? parseInt(params.id) : undefined;

  const { data: dynamicForm, isLoading } = useQuery<DynamicForm>({
    queryKey: ["/api/forms", formId],
    enabled: isEditing && !!formId,
  });

  const form = useForm<FormBuilderData>({
    resolver: zodResolver(formBuilderSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "course",
      active: 1,
      fieldsData: [
        { id: "1", type: "text", label: "Full Name", placeholder: "Enter your full name", required: true },
        { id: "2", type: "email", label: "Email Address", placeholder: "Enter your email", required: true },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "fieldsData",
  });

  useEffect(() => {
    if (dynamicForm && isEditing) {
      const fieldsData = JSON.parse(dynamicForm.fields) as FormField[];
      form.reset({
        title: dynamicForm.title,
        description: dynamicForm.description ?? "",
        type: dynamicForm.type,
        active: dynamicForm.active ?? 1,
        fieldsData,
      });
    }
  }, [dynamicForm, isEditing, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: FormBuilderData) => {
      const { fieldsData, ...formData } = data;
      const payload: InsertDynamicForm = {
        ...formData,
        fields: JSON.stringify(fieldsData),
      };

      if (isEditing && formId) {
        await apiRequest("PUT", `/api/forms/${formId}`, payload);
      } else {
        await apiRequest("POST", "/api/forms", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      toast({
        title: "Success",
        description: `Form ${isEditing ? "updated" : "created"} successfully`,
      });
      navigate("/admin/forms");
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} form`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormBuilderData) => {
    saveMutation.mutate(data);
  };

  const addField = () => {
    append({
      id: Date.now().toString(),
      type: "text",
      label: "New Field",
      placeholder: "",
      required: false,
    });
  };

  const fieldTypes = [
    { value: "text", label: "Text" },
    { value: "email", label: "Email" },
    { value: "tel", label: "Phone" },
    { value: "textarea", label: "Textarea" },
    { value: "select", label: "Select" },
    { value: "radio", label: "Radio" },
    { value: "checkbox", label: "Checkbox" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
  ];

  const formTypes = [
    { value: "course", label: "Course Registration" },
    { value: "hiring", label: "Job Application" },
    { value: "event", label: "Event Registration" },
  ];

  if (isLoading && isEditing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin/forms">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Forms
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-secondary font-space">
                  {isEditing ? "Edit Form" : "Create New Form"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? "Update your form configuration" : "Build a dynamic form for your needs"}
                </p>
              </div>
            </div>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={saveMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Form"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Builder */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Form Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter form title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of the form"
                              rows={3}
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Form Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {formTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between pt-8">
                            <FormLabel>Active</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value === 1}
                                onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Form Fields</CardTitle>
                    <Button type="button" onClick={addField} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="border-dashed">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                              <Badge variant="outline">Field {index + 1}</Badge>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`fieldsData.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Field Type</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {fieldTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`fieldsData.${index}.required`}
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between pt-8">
                                  <FormLabel>Required</FormLabel>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={`fieldsData.${index}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                  <Input placeholder="Field label" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`fieldsData.${index}.placeholder`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Placeholder</FormLabel>
                                <FormControl>
                                  <Input placeholder="Placeholder text" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{form.watch("title") || "Form Title"}</h3>
                    {form.watch("description") && (
                      <p className="text-gray-600 text-sm mt-1">{form.watch("description")}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {form.watch("fieldsData")?.map((field, index) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {field.type === "textarea" ? (
                          <Textarea 
                            placeholder={field.placeholder} 
                            disabled 
                            className="bg-gray-50"
                            rows={3}
                          />
                        ) : field.type === "select" ? (
                          <Select disabled>
                            <SelectTrigger className="bg-gray-50">
                              <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                          </Select>
                        ) : (
                          <Input 
                            type={field.type} 
                            placeholder={field.placeholder} 
                            disabled 
                            className="bg-gray-50"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <Button disabled className="w-full">
                    Submit Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
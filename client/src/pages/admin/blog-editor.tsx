import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Save, Eye, Upload, Image, Video, X, ImageIcon, VideoIcon } from "lucide-react";
import { insertBlogPostSchema, type BlogPost, type InsertBlogPost } from "@shared/schema";

export default function BlogEditor() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isEditing = params.id !== undefined;
  const blogId = params.id ? parseInt(params.id) : undefined;
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{url: string, type: string, name?: string}>>([]);

  const { data: blogPost, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog", blogId],
    enabled: isEditing && !!blogId,
  });

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: undefined,
      category: "",
      author: "Admin",
      authorAvatar: undefined,
      image: undefined,
      readTime: undefined,
      published: 0,
    },
  });

  useEffect(() => {
    if (blogPost && isEditing) {
      form.reset({
        title: blogPost.title,
        content: blogPost.content,
        excerpt: blogPost.excerpt || undefined,
        category: blogPost.category || "",
        author: blogPost.author,
        authorAvatar: blogPost.authorAvatar || undefined,
        image: blogPost.image || undefined,
        readTime: blogPost.readTime || undefined,
        published: blogPost.published ?? 0,
      });
    }
  }, [blogPost, isEditing, form]);

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      const newFiles = data.files.map((file: any) => ({
        url: file.url,
        type: file.resource_type === 'video' ? 'video' : 'image',
        name: `${file.resource_type === 'video' ? 'Video' : 'Image'} ${uploadedFiles.length + 1}`
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      toast({
        title: "Success",
        description: data.message || `${data.files.length} file(s) uploaded successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload media files",
        variant: "destructive",
      });
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      if (isEditing && blogId) {
        await apiRequest("PUT", `/api/blog/${blogId}`, data);
      } else {
        await apiRequest("POST", "/api/blog", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Success",
        description: `Blog post ${isEditing ? "updated" : "created"} successfully`,
      });
      navigate("/admin/blog");
    },
    onError: (error: any) => {
      let errorMessage = `Failed to ${isEditing ? "update" : "create"} blog post`;
      
      // Handle specific payload too large errors
      if (error?.message?.includes('413') || error?.message?.includes('payload') || error?.message?.includes('too large')) {
        errorMessage = "Content is too large. Try reducing text length or upload images separately.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBlogPost) => {
    saveMutation.mutate(data);
  };

  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      setUploading(true);
      uploadMutation.mutate(files, {
        onSettled: () => setUploading(false)
      });
    }
  };

  const insertMediaIntoContent = (url: string, type: string) => {
    const currentContent = form.getValues('content');
    const mediaTag = type === 'video'
      ? `<video src="${url}" controls style="max-width: 100%; height: auto; margin: 10px 0;"></video>`
      : `<img src="${url}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
    
    form.setValue('content', currentContent + '\n\n' + mediaTag);
    
    toast({
      title: "Success",
      description: "Media inserted into content",
    });
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading && isEditing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const categories = [
    "Technology",
    "Web Development",
    "AI & Machine Learning",
    "Business Automation",
    "Mobile Development",
    "Career Development",
    "Industry News",
    "Tutorials"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/admin/blog">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-secondary font-space">
                  {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing ? "Update your blog post content" : "Write and publish new content"}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => form.handleSubmit((data) => onSubmit({ ...data, published: 0 }))()}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => form.handleSubmit((data) => onSubmit({ ...data, published: 1 }))()}>
                <Eye className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Post Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter post title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of the post"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={uploading}
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*,video/*';
                                  input.multiple = true;
                                  input.onchange = handleFileSelect;
                                  input.click();
                                }}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {uploading ? 'Uploading...' : 'Upload Images & Videos'}
                              </Button>
                              <span className="text-sm text-gray-500 self-center">
                                Select multiple images and videos (up to 10 files)
                              </span>
                            </div>
                            
                            {/* Media Gallery */}
                            {uploadedFiles.length > 0 && (
                              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                <h4 className="text-sm font-medium mb-3">Uploaded Media ({uploadedFiles.length})</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {uploadedFiles.map((file, index) => (
                                    <div key={index} className="relative group border rounded-lg overflow-hidden bg-white">
                                      {file.type === 'video' ? (
                                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                          <VideoIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                      ) : (
                                        <img 
                                          src={file.url} 
                                          alt={file.name} 
                                          className="aspect-video object-cover w-full"
                                        />
                                      )}
                                      
                                      {/* Overlay with actions */}
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                          <Button 
                                            size="sm" 
                                            variant="secondary"
                                            onClick={() => insertMediaIntoContent(file.url, file.type)}
                                          >
                                            Insert
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="destructive"
                                            onClick={() => removeUploadedFile(index)}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      
                                      {/* File type indicator */}
                                      <div className="absolute top-2 right-2">
                                        {file.type === 'video' ? (
                                          <VideoIcon className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
                                        ) : (
                                          <ImageIcon className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                  Click "Insert" to add media to your blog content, or "×" to remove from gallery
                                </p>
                              </div>
                            )}
                            <FormControl>
                              <Textarea 
                                placeholder="Write your blog post content here... You can use HTML tags for formatting."
                                rows={15}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input placeholder="Author name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5 min read" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Published</FormLabel>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorAvatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
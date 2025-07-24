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
import { MediaUpload, MediaPreview } from "@/components/ui/media-upload";
import { ImageGallery } from "@/components/ui/image-gallery";
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
      excerpt: "",
      category: "",
      author: "Admin",
      authorAvatar: "",
      image: "",
      readTime: "",
      published: 0,
    },
  });

  useEffect(() => {
    if (blogPost && isEditing) {
      form.reset({
        title: blogPost.title,
        content: blogPost.content,
        excerpt: blogPost.excerpt || "",
        category: blogPost.category || "",
        author: blogPost.author,
        authorAvatar: blogPost.authorAvatar || "",
        image: blogPost.image || "",
        readTime: blogPost.readTime || "",
        published: blogPost.published ?? 0,
      });

      // Extract existing images and videos from content
      const content = blogPost.content;
      const mediaFiles: Array<{url: string, type: string, name?: string}> = [];
      
      // Extract images
      const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
      let imgMatch;
      let imgCount = 1;
      while ((imgMatch = imgRegex.exec(content)) !== null) {
        const url = imgMatch[1];
        if (url && !url.startsWith('data:') && !mediaFiles.some(f => f.url === url)) {
          mediaFiles.push({
            url: url,
            type: 'image',
            name: `Existing Image ${imgCount++}`
          });
        }
      }
      
      // Extract videos
      const videoRegex = /<video[^>]+src="([^">]+)"[^>]*>/g;
      let videoMatch;
      let videoCount = 1;
      while ((videoMatch = videoRegex.exec(content)) !== null) {
        const url = videoMatch[1];
        if (url && !url.startsWith('data:') && !mediaFiles.some(f => f.url === url)) {
          mediaFiles.push({
            url: url,
            type: 'video',
            name: `Existing Video ${videoCount++}`
          });
        }
      }
      
      setUploadedFiles(mediaFiles);
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
      ? `<video src="${url}" controls style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 16px 0;"></video>`
      : `<img src="${url}" alt="Uploaded image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;
    
    form.setValue('content', currentContent + '\n\n' + mediaTag);
    
    toast({
      title: "Media inserted",
      description: `${type === 'image' ? 'Image' : 'Video'} added to your blog content`
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
                            <div className="mb-4">
                              <MediaUpload
                                onUpload={(result) => {
                                  const newFile = {
                                    url: result.url,
                                    type: result.type,
                                    name: `${result.type}-${Date.now()}.${result.format}`
                                  };
                                  setUploadedFiles(prev => [...prev, newFile]);
                                  
                                  // Auto-insert into content
                                  const currentContent = form.getValues('content');
                                  const mediaHtml = result.type === 'image' 
                                    ? `<img src="${result.url}" alt="${newFile.name}" style="max-width: 100%; height: auto; border-radius: 8px;" />`
                                    : `<video src="${result.url}" controls style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;" />`;
                                  
                                  form.setValue('content', currentContent + '\n\n' + mediaHtml);
                                }}
                                acceptedTypes="both"
                                maxSize={100}
                                className="mb-4"
                              />
                            </div>
                            
                            {/* Enhanced Media Gallery */}
                            {uploadedFiles.length > 0 && (
                              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                <ImageGallery
                                  media={uploadedFiles}
                                  onInsert={(item) => insertMediaIntoContent(item.url, item.type)}
                                  onRemove={(index) => removeUploadedFile(index)}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                  Click "Insert" to add media to your blog content, or preview to see full size
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
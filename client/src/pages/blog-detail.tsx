import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";

export default function BlogDetail() {
  const params = useParams();
  const blogId = params.id ? parseInt(params.id) : undefined;

  const { data: blogPost, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", blogId],
    enabled: !!blogId,
  });

  // Category color mapping
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Web Development": "bg-primary/10 text-primary",
      "AI & Machine Learning": "bg-accent/10 text-accent", 
      "Career Development": "bg-secondary/10 text-secondary",
      "Business Automation": "bg-orange-100 text-orange-700",
      "Mobile Development": "bg-green-100 text-green-700",
      "Technology": "bg-blue-100 text-blue-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Blog Post Header */}
        <article className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="mb-6">
            <Badge className={getCategoryColor(blogPost.category || "")}>
              {blogPost.category}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-secondary mb-4 leading-tight">
            {blogPost.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-8">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {blogPost.author}
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              {format(new Date(blogPost.createdAt), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {blogPost.readTime || "5 min read"}
            </div>
          </div>

          {/* Featured Image */}
          {blogPost.image && (
            <img 
              src={blogPost.image} 
              alt={blogPost.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Excerpt */}
          {blogPost.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed mb-8 italic border-l-4 border-primary pl-6">
              {blogPost.excerpt}
            </p>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-secondary prose-links:text-primary prose-strong:text-secondary"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </article>

        {/* Author Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mr-4">
              {blogPost.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary">{blogPost.author}</h3>
              <p className="text-gray-600">Author at TechNurture</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
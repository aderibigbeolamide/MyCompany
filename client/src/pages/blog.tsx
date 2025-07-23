import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User } from "lucide-react";

export default function Blog() {
  const articles = [
    {
      id: "modern-web-development",
      title: "10 Modern Web Development Trends to Watch in 2025",
      excerpt: "Discover the latest trends shaping the future of web development, from AI integration to progressive web apps.",
      category: "Web Development",
      categoryColor: "bg-primary/10 text-primary",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      author: {
        name: "John Smith",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
      }
    },
    {
      id: "ai-business-integration",
      title: "How AI is Transforming Small Business Operations",
      excerpt: "Learn how small businesses can leverage AI tools to streamline operations and improve customer experience.",
      category: "AI & Machine Learning",
      categoryColor: "bg-accent/10 text-accent",
      date: "Dec 12, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
      }
    },
    {
      id: "tech-career-guide",
      title: "Complete Guide to Starting Your Tech Career in 2025",
      excerpt: "A comprehensive roadmap for beginners looking to break into the tech industry and build a successful career.",
      category: "Career Development",
      categoryColor: "bg-secondary/10 text-secondary",
      date: "Dec 10, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      author: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
      }
    },
    {
      id: "react-best-practices",
      title: "React Best Practices for Enterprise Applications",
      excerpt: "Essential patterns and practices for building scalable React applications in enterprise environments.",
      category: "Web Development",
      categoryColor: "bg-primary/10 text-primary",
      date: "Dec 8, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      author: {
        name: "John Smith",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
      }
    },
    {
      id: "machine-learning-basics",
      title: "Machine Learning Fundamentals Every Developer Should Know",
      excerpt: "Understanding the core concepts of machine learning and how to get started with your first ML project.",
      category: "AI & Machine Learning",
      categoryColor: "bg-accent/10 text-accent",
      date: "Dec 5, 2024",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
      }
    },
    {
      id: "data-visualization-tools",
      title: "Top Data Visualization Tools for Modern Analytics",
      excerpt: "A comprehensive comparison of the best data visualization tools and when to use each one.",
      category: "Data Analysis",
      categoryColor: "bg-orange-100 text-orange-800",
      date: "Dec 3, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      author: {
        name: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
      }
    }
  ];

  const categories = [
    "All",
    "Web Development",
    "AI & Machine Learning",
    "Career Development",
    "Data Analysis"
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 font-space">
              Resources & Insights
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest trends, tutorials, and insights from the tech world. Learn from industry experts and advance your skills.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <Button 
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 ? "bg-primary hover:bg-blue-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-2">Featured Article</h2>
            <p className="text-gray-600">Our latest and most popular content</p>
          </div>
          
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={articles[0].image} 
                  alt={articles[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={articles[0].categoryColor}>{articles[0].category}</Badge>
                  <div className="flex items-center text-gray-500 text-sm">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {articles[0].date}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {articles[0].readTime}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4 hover:text-primary transition-colors duration-200">
                  {articles[0].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {articles[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={articles[0].author.avatar} 
                      alt={articles[0].author.name}
                      className="w-10 h-10 rounded-full mr-3" 
                    />
                    <div>
                      <p className="font-medium text-secondary">{articles[0].author.name}</p>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-blue-700">
                    Read Article
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-secondary mb-2">Latest Articles</h2>
            <p className="text-gray-600">Explore our comprehensive collection of tech insights and tutorials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(1).map((article) => (
              <Card key={article.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover" 
                />
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={article.categoryColor}>{article.category}</Badge>
                    <span className="text-gray-500 text-sm">{article.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-3 hover:text-primary transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={article.author.avatar} 
                        alt={article.author.name}
                        className="w-8 h-8 rounded-full mr-3" 
                      />
                      <div>
                        <p className="text-sm font-medium text-secondary">{article.author.name}</p>
                        <p className="text-xs text-gray-500">{article.readTime}</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-primary hover:text-blue-700 text-sm font-medium">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-4 text-lg font-semibold"
            >
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to our newsletter for the latest tech insights, tutorials, and industry news delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button className="bg-primary hover:bg-blue-700 text-white px-6 py-3">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Code, Brain, BarChart, Clock, Users, Award, CheckCircle } from "lucide-react";
import EnrollmentForm from "@/components/forms/enrollment-form";

export default function Academy() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const courses = [
    {
      id: "web-development",
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Full-Stack Web Development",
      level: "Intermediate",
      levelColor: "bg-yellow-100 text-yellow-800",
      description: "Master modern web development with React, Node.js, and cloud deployment.",
      duration: "12 weeks",
      schedule: "Evenings & Weekends",
      price: "$2,499",
      features: [
        "HTML, CSS, JavaScript Fundamentals",
        "React.js & Next.js Development",
        "Node.js & Express.js Backend",
        "Database Design (PostgreSQL, MongoDB)",
        "RESTful API Development",
        "Cloud Deployment (AWS, Vercel)",
        "Git Version Control",
        "Project Portfolio Development"
      ],
      outcomes: [
        "Build full-stack web applications",
        "Deploy applications to production",
        "Work with modern development tools",
        "Understand software architecture"
      ]
    },
    {
      id: "ai-ml",
      icon: <Brain className="h-8 w-8 text-accent" />,
      title: "AI & Machine Learning",
      level: "Advanced",
      levelColor: "bg-red-100 text-red-800",
      description: "Dive deep into artificial intelligence, machine learning algorithms, and data science.",
      duration: "16 weeks",
      schedule: "Weekends",
      price: "$3,299",
      features: [
        "Python Programming for AI",
        "Machine Learning Algorithms",
        "Deep Learning with TensorFlow",
        "Natural Language Processing",
        "Computer Vision",
        "Data Analysis with Pandas",
        "Model Deployment",
        "AI Ethics & Best Practices"
      ],
      outcomes: [
        "Develop AI-powered applications",
        "Implement machine learning models",
        "Process and analyze large datasets",
        "Deploy AI solutions to production"
      ]
    },
    {
      id: "data-analysis",
      icon: <BarChart className="h-8 w-8 text-secondary" />,
      title: "Data Analysis & Visualization",
      level: "Beginner",
      levelColor: "bg-green-100 text-green-800",
      description: "Learn to analyze data and create compelling visualizations using Python and modern tools.",
      duration: "10 weeks",
      schedule: "Flexible",
      price: "$1,899",
      features: [
        "Python for Data Analysis",
        "Statistical Analysis",
        "Data Visualization with Matplotlib",
        "Interactive Dashboards with Plotly",
        "SQL for Data Querying",
        "Excel Integration",
        "Business Intelligence Tools",
        "Data Storytelling"
      ],
      outcomes: [
        "Analyze business data effectively",
        "Create interactive visualizations",
        "Generate actionable insights",
        "Present data-driven recommendations"
      ]
    }
  ];

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience."
    },
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: "Career Support",
      description: "Get help with job placement, resume building, and interview preparation."
    },
    {
      icon: <Clock className="h-8 w-8 text-secondary" />,
      title: "Flexible Schedule",
      description: "Choose from evening, weekend, or self-paced learning options."
    }
  ];

  const stats = [
    { number: "95%", label: "Job Placement Rate" },
    { number: "200+", label: "Graduates" },
    { number: "12", label: "Average Weeks" },
    { number: "4.9/5", label: "Student Rating" }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 font-space">
              TechNurture Academy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advance your career with our comprehensive training programs designed for the future of technology. Learn from industry experts and build real-world projects.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Why Choose Our Academy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide more than just education - we provide a pathway to your dream career in technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Students learning technology" 
                className="rounded-2xl shadow-2xl w-full" 
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-secondary mb-6 font-space">Learn From Industry Experts</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our academy offers hands-on training programs that combine theoretical knowledge with practical experience. Join hundreds of successful graduates who have transformed their careers.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">95%</div>
                  <div className="text-gray-600">Job Placement Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">12 Weeks</div>
                  <div className="text-gray-600">Average Program</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Our Training Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive training programs designed to give you the skills needed for today's tech industry.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                      {course.icon}
                    </div>
                    <Badge className={course.levelColor}>{course.level}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-secondary mb-4">{course.title}</h3>
                  <p className="text-gray-600 mb-6">{course.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="font-medium">{course.schedule}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-primary">{course.price}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-secondary mb-3">What You'll Learn:</h4>
                    <ul className="space-y-2">
                      {course.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {course.features.length > 4 && (
                        <li className="text-sm text-gray-500">+ {course.features.length - 4} more topics</li>
                      )}
                    </ul>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        Enroll Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <EnrollmentForm course={course.title} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-4 text-lg font-semibold"
              >
                Have Questions? Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our graduates who have successfully transitioned into exciting tech careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" 
                    alt="Student" 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h4 className="font-semibold text-secondary">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600">Full-Stack Developer at TechCorp</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The web development program gave me all the skills I needed to land my dream job. The instructors were amazing and the hands-on projects really prepared me for the real world."
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" 
                    alt="Student" 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h4 className="font-semibold text-secondary">Mike Chen</h4>
                    <p className="text-sm text-gray-600">AI Engineer at DataWorks</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The AI program was incredibly comprehensive. I went from having no ML experience to building production AI systems. The career support team helped me find the perfect role."
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b332c1d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" 
                    alt="Student" 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h4 className="font-semibold text-secondary">Emily Rodriguez</h4>
                    <p className="text-sm text-gray-600">Data Analyst at FinanceHub</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I transitioned from marketing to data analysis thanks to this program. The flexible schedule allowed me to learn while working, and now I have a career I'm passionate about."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

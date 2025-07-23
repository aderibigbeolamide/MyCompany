import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Brain, Bot, BarChart, Zap } from "lucide-react";
import { Link } from "wouter";
import ContactForm from "@/components/forms/contact-form";

export default function AIIntegration() {
  const technologies = [
    { name: "OpenAI GPT", category: "LLM" },
    { name: "Claude", category: "LLM" },
    { name: "LangChain", category: "Framework" },
    { name: "TensorFlow", category: "ML" },
    { name: "PyTorch", category: "ML" },
    { name: "Hugging Face", category: "Models" },
    { name: "Python", category: "Language" },
    { name: "FastAPI", category: "Backend" },
    { name: "Streamlit", category: "UI" },
    { name: "Docker", category: "Deployment" },
    { name: "AWS SageMaker", category: "Cloud" },
    { name: "Vector Databases", category: "Storage" }
  ];

  const services = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "Intelligent Chatbots",
      description: "AI-powered conversational interfaces for customer support and engagement",
      features: ["Natural Language Processing", "Context-Aware Responses", "Multi-Platform Integration", "Analytics & Insights"]
    },
    {
      icon: <BarChart className="h-8 w-8 text-accent" />,
      title: "Data Analytics & Insights",
      description: "Transform your data into actionable insights with AI-powered analytics",
      features: ["Predictive Analytics", "Pattern Recognition", "Automated Reporting", "Real-time Dashboards"]
    },
    {
      icon: <Brain className="h-8 w-8 text-secondary" />,
      title: "Process Automation",
      description: "Automate complex business processes with intelligent AI workflows",
      features: ["Workflow Automation", "Document Processing", "Decision Trees", "Integration APIs"]
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Custom AI Solutions",
      description: "Tailored AI applications designed specifically for your business needs",
      features: ["Machine Learning Models", "Computer Vision", "Natural Language Processing", "Recommendation Systems"]
    }
  ];

  const benefits = [
    {
      title: "Increased Efficiency",
      description: "Automate repetitive tasks and free up your team for strategic work",
      metric: "70% time savings"
    },
    {
      title: "Better Decision Making",
      description: "Data-driven insights help you make informed business decisions",
      metric: "40% better accuracy"
    },
    {
      title: "Enhanced Customer Experience",
      description: "24/7 intelligent support and personalized interactions",
      metric: "90% satisfaction rate"
    },
    {
      title: "Competitive Advantage",
      description: "Stay ahead with cutting-edge AI technology implementation",
      metric: "3x faster growth"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 font-space">
              AI Integration Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your business with intelligent automation and AI-powered solutions. From chatbots to predictive analytics, we make AI work for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#contact">
                <Button size="lg" className="bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Get AI Solutions
                </Button>
              </Link>
              <Link href="#technologies">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  View AI Stack
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Our AI Integration Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI solutions designed to enhance your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="mt-2">{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 text-accent mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Why Choose AI Integration?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the transformative impact of AI on your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{benefit.metric}</div>
                  <h3 className="text-lg font-semibold text-secondary mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              AI Technologies & Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We leverage the most advanced AI technologies and frameworks
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="font-semibold text-secondary mb-1">{tech.name}</div>
                <Badge variant="secondary" className="text-xs">{tech.category}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
                Ready to Integrate AI?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform your business with intelligent AI solutions. Contact us to discuss how AI can revolutionize your operations and drive growth.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Free AI readiness assessment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Custom AI strategy development</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Proof of concept delivery</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Ongoing AI optimization</span>
                </div>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Start Your AI Journey</CardTitle>
                  <CardDescription>
                    Let's explore how AI can transform your business operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Brain, ServerCog, CheckCircle, ArrowRight, Smartphone, Database, Cloud } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Web Development",
      description: "Custom web applications, responsive websites, and e-commerce solutions built with modern technologies.",
      features: [
        "React.js & Next.js Development",
        "E-commerce Solutions",
        "API Integration",
        "Responsive Design",
        "Performance Optimization"
      ],
      technologies: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS"]
    },
    {
      icon: <Brain className="h-8 w-8 text-accent" />,
      title: "AI Integration",
      description: "Transform your business processes with intelligent automation and AI-powered solutions.",
      features: [
        "Chatbot Development",
        "Process Automation",
        "Data Analytics",
        "Machine Learning Models",
        "Natural Language Processing"
      ],
      technologies: ["Python", "TensorFlow", "OpenAI", "LangChain", "Pandas"]
    },
    {
      icon: <ServerCog className="h-8 w-8 text-secondary" />,
      title: "Business Automation",
      description: "Streamline operations and boost productivity with tailored automation solutions.",
      features: [
        "Workflow Optimization",
        "CRM Integration",
        "Custom Dashboards",
        "Report Generation",
        "Task Automation"
      ],
      technologies: ["Zapier", "Power Automate", "Python", "REST APIs", "SQL"]
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications for iOS and Android.",
      features: [
        "React Native Development",
        "iOS & Android Apps",
        "Cross-platform Solutions",
        "App Store Deployment",
        "Mobile UI/UX Design"
      ],
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"]
    },
    {
      icon: <Database className="h-8 w-8 text-accent" />,
      title: "Database Solutions",
      description: "Robust database design, optimization, and management for your applications.",
      features: [
        "Database Design",
        "Performance Optimization",
        "Data Migration",
        "Backup & Recovery",
        "Security Implementation"
      ],
      technologies: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Elasticsearch"]
    },
    {
      icon: <Cloud className="h-8 w-8 text-secondary" />,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment solutions for modern applications.",
      features: [
        "Cloud Migration",
        "DevOps Implementation",
        "Container Orchestration",
        "CI/CD Pipelines",
        "Monitoring & Logging"
      ],
      technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery",
      description: "We start by understanding your business needs, challenges, and goals through detailed consultation."
    },
    {
      step: "02",
      title: "Planning",
      description: "Our team creates a comprehensive project plan with timelines, milestones, and technical specifications."
    },
    {
      step: "03",
      title: "Development",
      description: "We build your solution using best practices, with regular updates and feedback sessions."
    },
    {
      step: "04",
      title: "Testing",
      description: "Rigorous testing ensures your solution meets all requirements and performs optimally."
    },
    {
      step: "05",
      title: "Deployment",
      description: "We deploy your solution and provide training and support for smooth implementation."
    },
    {
      step: "06",
      title: "Support",
      description: "Ongoing maintenance and support to ensure your solution continues to perform excellently."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 font-space">
              Our Professional Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver comprehensive technology solutions that drive business growth and innovation through cutting-edge development and strategic consulting.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                <CardContent className="p-0">
                  <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-secondary mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-secondary mb-3">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link href="/contact">
                    <button className="text-primary hover:text-blue-700 font-semibold group-hover:underline transition-all duration-200 flex items-center">
                      Get Quote <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a proven methodology to ensure your project is delivered on time, within budget, and exceeds expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="bg-primary text-white text-2xl font-bold w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Let's discuss how we can help you achieve your business goals with our comprehensive technology solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg"
                className="bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
              >
                Get Free Consultation
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-4 text-lg font-semibold"
              >
                Learn About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

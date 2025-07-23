import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Brain, ServerCog, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Web Development",
      description: "Custom web applications, responsive websites, and e-commerce solutions built with modern technologies.",
      features: ["React.js & Next.js Development", "E-commerce Solutions", "API Integration"]
    },
    {
      icon: <Brain className="h-8 w-8 text-accent" />,
      title: "AI Integration",
      description: "Transform your business processes with intelligent automation and AI-powered solutions.",
      features: ["Chatbot Development", "Process Automation", "Data Analytics"]
    },
    {
      icon: <ServerCog className="h-8 w-8 text-secondary" />,
      title: "Business Automation",
      description: "Streamline operations and boost productivity with tailored automation solutions.",
      features: ["Workflow Optimization", "CRM Integration", "Custom Dashboards"]
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Digital technology and data visualization" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-primary/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-space">
              Transform Your Business with{" "}
              <span className="text-accent">Next-Gen Technology</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              We provide cutting-edge web development, AI integration, and comprehensive training programs to help businesses and individuals thrive in the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-emerald-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Explore Services
                </Button>
              </Link>
              <Link href="/academy">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-secondary px-8 py-4 text-lg font-semibold transition-all duration-200"
                >
                  Join Academy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
                Empowering Digital Transformation Since Day One
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At TechNurture, we believe in the power of technology to transform businesses and lives. Our mission is to bridge the gap between cutting-edge technology and practical business solutions.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-gray-600">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">200+</div>
                  <div className="text-gray-600">Students Trained</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Expert-led development and training</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Cutting-edge AI integration solutions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Personalized learning experiences</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional team meeting" 
                className="rounded-2xl shadow-2xl w-full" 
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-primary mb-1">5+ Years</div>
                <div className="text-gray-600">Industry Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Our Professional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver comprehensive technology solutions that drive business growth and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                <CardContent className="p-0">
                  <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-accent mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <button className="text-primary hover:text-blue-700 font-semibold group-hover:underline transition-all duration-200 flex items-center">
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button 
                size="lg"
                className="bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join hundreds of successful companies and individuals who have transformed their operations with our technology solutions and training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button 
                size="lg"
                className="bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
              >
                Get Started Today
              </Button>
            </Link>
            <Link href="/academy">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-4 text-lg font-semibold"
              >
                Explore Academy
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

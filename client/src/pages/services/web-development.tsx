import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Code, Palette, Zap, Globe, Database, Shield } from "lucide-react";
import { Link } from "wouter";
import ContactForm from "@/components/forms/contact-form";

export default function WebDevelopment() {
  const technologies = [
    { name: "React.js", category: "Frontend" },
    { name: "Vue.js", category: "Frontend" },
    { name: "Angular", category: "Frontend" },
    { name: "Svelte", category: "Frontend" },
    { name: "Next.js", category: "Framework" },
    { name: "Nuxt.js", category: "Framework" },
    { name: "SvelteKit", category: "Framework" },
    { name: "Gatsby", category: "Framework" },
    { name: "TypeScript", category: "Language" },
    { name: "JavaScript", category: "Language" },
    { name: "Python", category: "Language" },
    { name: "PHP", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Bootstrap", category: "Styling" },
    { name: "Sass/SCSS", category: "Styling" },
    { name: "Material-UI", category: "Styling" },
    { name: "Node.js", category: "Backend" },
    { name: "Express.js", category: "Backend" },
    { name: "Django", category: "Backend" },
    { name: "FastAPI", category: "Backend" },
    { name: "Laravel", category: "Backend" },
    { name: "Spring Boot", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "MongoDB", category: "Database" },
    { name: "MySQL", category: "Database" },
    { name: "Redis", category: "Database" },
    { name: "AWS", category: "Cloud" },
    { name: "Google Cloud", category: "Cloud" },
    { name: "Azure", category: "Cloud" },
    { name: "Vercel", category: "Deployment" },
    { name: "Netlify", category: "Deployment" },
    { name: "Heroku", category: "Deployment" },
    { name: "Docker", category: "DevOps" },
    { name: "Kubernetes", category: "DevOps" },
    { name: "Git", category: "Version Control" },
    { name: "GitHub Actions", category: "CI/CD" }
  ];

  const services = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Custom Web Applications",
      description: "Scalable, responsive web applications built with modern technologies",
      features: ["React.js/Next.js Development", "Progressive Web Apps (PWA)", "API Integration", "Real-time Features"]
    },
    {
      icon: <Palette className="h-8 w-8 text-accent" />,
      title: "E-commerce Solutions",
      description: "Complete online stores with payment integration and inventory management",
      features: ["Shopping Cart Systems", "Payment Gateway Integration", "Inventory Management", "Order Tracking"]
    },
    {
      icon: <Database className="h-8 w-8 text-secondary" />,
      title: "Backend Development",
      description: "Robust APIs and database solutions to power your applications",
      features: ["RESTful API Development", "Database Design", "Authentication Systems", "Cloud Integration"]
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Security & Performance",
      description: "Ensure your applications are secure, fast, and reliable",
      features: ["Security Audits", "Performance Optimization", "SSL Certificates", "Data Protection"]
    }
  ];

  const process = [
    {
      step: "1",
      title: "Discovery & Planning",
      description: "We analyze your requirements and create a detailed project roadmap"
    },
    {
      step: "2",
      title: "Design & Prototyping",
      description: "Creating wireframes and prototypes to visualize your application"
    },
    {
      step: "3",
      title: "Development",
      description: "Building your application with clean, maintainable code"
    },
    {
      step: "4",
      title: "Testing & Deployment",
      description: "Thorough testing and seamless deployment to production"
    },
    {
      step: "5",
      title: "Support & Maintenance",
      description: "Ongoing support and updates to keep your application running smoothly"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 font-space">
              Web Development Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Build powerful, scalable web applications that drive business growth. From concept to deployment, we deliver excellence at every step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#contact">
                <Button size="lg" className="bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Start Your Project
                </Button>
              </Link>
              <Link href="#technologies">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  View Technologies
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
              Our Web Development Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive web development solutions tailored to your business needs
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

      {/* Technologies Section */}
      <section id="technologies" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Technologies We Use
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We choose the best technology stack for each project based on your specific requirements and goals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="font-semibold text-secondary mb-1">{tech.name}</div>
                <Badge variant="secondary" className="text-xs">{tech.category}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures successful project delivery
            </p>
          </div>

          <div className="space-y-8">
            {process.map((step, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
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
                Ready to Build Your Web Application?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Let's discuss your project requirements and create a solution that drives your business forward. Contact us today for a free consultation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Free initial consultation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Detailed project proposal</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Transparent pricing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Ongoing support</span>
                </div>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Get Started Today</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours
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
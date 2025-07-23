import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Settings, BarChart3, Workflow, Zap } from "lucide-react";
import { Link } from "wouter";
import ContactForm from "@/components/forms/contact-form";

export default function BusinessAutomation() {
  const technologies = [
    { name: "Zapier", category: "Automation" },
    { name: "Microsoft Power Automate", category: "Automation" },
    { name: "Salesforce", category: "CRM" },
    { name: "HubSpot", category: "CRM" },
    { name: "Slack", category: "Communication" },
    { name: "Microsoft Teams", category: "Communication" },
    { name: "Google Workspace", category: "Productivity" },
    { name: "Notion", category: "Documentation" },
    { name: "Airtable", category: "Database" },
    { name: "Monday.com", category: "Project Management" },
    { name: "REST APIs", category: "Integration" },
    { name: "Webhooks", category: "Integration" }
  ];

  const services = [
    {
      icon: <Workflow className="h-8 w-8 text-primary" />,
      title: "Workflow Automation",
      description: "Streamline complex business processes and eliminate manual tasks",
      features: ["Process Mapping", "Task Automation", "Approval Workflows", "Document Management"]
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-accent" />,
      title: "CRM Integration",
      description: "Connect your systems for seamless customer relationship management",
      features: ["Lead Management", "Sales Pipeline", "Customer Support", "Reporting & Analytics"]
    },
    {
      icon: <Settings className="h-8 w-8 text-secondary" />,
      title: "System Integration",
      description: "Connect disparate systems for unified business operations",
      features: ["API Development", "Data Synchronization", "Legacy System Integration", "Cloud Migration"]
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Custom Dashboards",
      description: "Real-time insights and analytics for informed decision making",
      features: ["Executive Dashboards", "KPI Tracking", "Real-time Monitoring", "Custom Reports"]
    }
  ];

  const automationAreas = [
    {
      area: "Sales & Marketing",
      processes: ["Lead qualification", "Email campaigns", "Follow-up sequences", "Customer onboarding"],
      timesSaved: "15+ hours/week"
    },
    {
      area: "Finance & Accounting",
      processes: ["Invoice processing", "Expense tracking", "Payment reminders", "Financial reporting"],
      timesSaved: "20+ hours/week"
    },
    {
      area: "HR & Operations",
      processes: ["Employee onboarding", "Leave management", "Performance tracking", "Payroll processing"],
      timesSaved: "25+ hours/week"
    },
    {
      area: "Customer Support",
      processes: ["Ticket routing", "Response templates", "Escalation rules", "Feedback collection"],
      timesSaved: "30+ hours/week"
    }
  ];

  const benefits = [
    {
      title: "Increased Productivity",
      description: "Automate repetitive tasks and focus on strategic work",
      metric: "3x faster processing"
    },
    {
      title: "Reduced Errors",
      description: "Eliminate human errors with automated processes",
      metric: "95% error reduction"
    },
    {
      title: "Cost Savings",
      description: "Reduce operational costs through efficient automation",
      metric: "40% cost reduction"
    },
    {
      title: "Better Compliance",
      description: "Ensure consistent adherence to business rules and regulations",
      metric: "100% compliance"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 font-space">
              Business Automation Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Streamline your operations and boost productivity with intelligent business automation solutions. Focus on growth while we handle the processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#contact">
                <Button size="lg" className="bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Automate Your Business
                </Button>
              </Link>
              <Link href="#automation-areas">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  View Solutions
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
              Our Automation Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive automation solutions tailored to your business needs
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

      {/* Automation Areas Section */}
      <section id="automation-areas" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Areas We Automate
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform every aspect of your business with intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {automationAreas.map((area, index) => (
              <Card key={index} className="bg-white border border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{area.area}</CardTitle>
                    <Badge variant="secondary" className="bg-accent text-white">
                      {area.timesSaved}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {area.processes.map((process, processIndex) => (
                      <div key={processIndex} className="flex items-center text-gray-600">
                        <CheckCircle className="h-4 w-4 text-accent mr-2" />
                        {process}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Business Automation Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the measurable impact of automation on your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border border-gray-200">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Automation Tools & Platforms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with industry-leading automation platforms and tools
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
                Ready to Automate Your Business?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform your operations with intelligent automation. Let's identify the processes that can benefit from automation and boost your productivity.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Free automation assessment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Custom automation roadmap</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">ROI-focused implementation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Training and support</span>
                </div>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Start Automation Today</CardTitle>
                  <CardDescription>
                    Let's discuss your automation needs and create a solution plan
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
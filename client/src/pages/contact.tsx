import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, Youtube } from "lucide-react";
import ContactForm from "@/components/forms/contact-form";

export default function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email Us",
      details: ["technurture619@gmail.com", "support@technurture.com"]
    },
    {
      icon: <Phone className="h-6 w-6 text-accent" />,
      title: "Call Us",
      details: ["+234 810-7183-206", "+234 815-1163-966"]
    },
    {
      icon: <MapPin className="h-6 w-6 text-secondary" />,
      title: "Visit Us",
      details: ["No. 2 Alheri Close", "FCT, Abuja Nigeria"]
    }
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "#",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "#",
      color: "bg-blue-400 hover:bg-blue-500"
    },
    {
      icon: <Github className="h-5 w-5" />,
      href: "#",
      color: "bg-gray-800 hover:bg-gray-900"
    },
    {
      icon: <Youtube className="h-5 w-5" />,
      href: "#",
      color: "bg-red-600 hover:bg-red-700"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 font-space">
              Let's Talk About Your Goals
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Whether you need a website, want to learn coding, or have a tech idea - we're here to help make it happen.
            </p>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
              <p className="text-lg text-gray-700 mb-4">
                💡 <strong>Not sure where to start?</strong> That's okay! Just tell us what you're trying to achieve, and we'll guide you through the best options.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-800">For Businesses</p>
                  <p className="text-sm text-blue-600">Websites, apps, automation</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-800">For Learners</p>
                  <p className="text-sm text-green-600">Coding, AI, career growth</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-800">For Ideas</p>
                  <p className="text-sm text-purple-600">Turn concepts into reality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-8 font-space">
                Let's Start a Conversation
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're a business looking for technology solutions or an individual ready to advance your career, we're here to help. Reach out to us through any of the channels below.
              </p>

              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary mb-2">{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media Links */}
              <div>
                <h3 className="font-semibold text-secondary mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`${social.color} text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="mt-8 p-6 bg-neutral-50 rounded-2xl">
                <h3 className="font-semibold text-secondary mb-4">Office Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="bg-white rounded-2xl shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-secondary mb-6">Send us a Message</h3>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get quick answers to common questions about our services and programs.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-secondary mb-3">How long does a typical web development project take?</h3>
                <p className="text-gray-600">
                  Project timelines vary based on complexity and requirements. Simple websites typically take 2-4 weeks, while complex web applications can take 8-12 weeks. We provide detailed timelines during our initial consultation.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-secondary mb-3">Do you offer payment plans for academy courses?</h3>
                <p className="text-gray-600">
                  Yes, we offer flexible payment options including installment plans for all our academy courses. Contact us to discuss payment arrangements that work for your budget.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-secondary mb-3">Can you help with ongoing maintenance and support?</h3>
                <p className="text-gray-600">
                  Absolutely! We provide comprehensive maintenance and support packages for all projects we develop. This includes security updates, feature enhancements, and technical support.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-secondary mb-3">What's the job placement rate for academy graduates?</h3>
                <p className="text-gray-600">
                  Our academy maintains a 95% job placement rate within 6 months of graduation. We provide career support including resume building, interview preparation, and job placement assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4 font-space">Find Us</h2>
            <p className="text-gray-600">Visit our office in Abuja, Nigeria</p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map would be integrated here</p>
              <p className="text-sm text-gray-500 mt-2">No. 2 Alheri Close, FCT, Abuja Nigeria</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

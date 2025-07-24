import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Award, Target } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description: "We stay at the forefront of technology trends to deliver cutting-edge solutions."
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Collaboration",
      description: "We work closely with our clients to understand their unique needs and challenges."
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      title: "Excellence",
      description: "We are committed to delivering high-quality solutions that exceed expectations."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-6 font-space">
              Who We Are
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We help people and businesses succeed with technology. Whether you need a website built or want to learn coding, we're here to support your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional team meeting" 
                className="rounded-2xl shadow-2xl w-full" 
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8 font-space">
                Our Mission & Vision
              </h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-secondary mb-4">What We Do</h3>
                <p className="text-gray-600 leading-relaxed">
                  We make technology work for you. Whether you're a business owner who needs a website, 
                  someone looking to learn new skills, or have a tech idea you want to bring to life - 
                  we help make it happen in a way that actually makes sense.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-secondary mb-4">Our Goal</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be the place people think of when they need tech help. We want to create a world 
                  where anyone can achieve their goals with technology, regardless of their background 
                  or current skill level.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Client-focused approach</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Continuous learning and improvement</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3" />
                  <span className="text-gray-700">Commitment to quality and innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-gray-600 font-medium">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">50+</div>
              <div className="text-gray-600 font-medium">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">200+</div>
              <div className="text-gray-600 font-medium">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-600 font-medium">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide everything we do and shape how we work with our clients and students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-space">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  TechNurture was founded with a simple yet powerful vision: to make cutting-edge 
                  technology accessible to businesses of all sizes and to provide world-class 
                  training that empowers individuals to build successful careers in tech.
                </p>
                <p>
                  Starting as a small team of passionate developers and educators, we've grown 
                  into a comprehensive technology partner that serves clients across various 
                  industries. Our journey has been marked by continuous learning, innovation, 
                  and a commitment to excellence.
                </p>
                <p>
                  Today, we're proud to have helped dozens of businesses transform their 
                  operations through technology and to have trained hundreds of students 
                  who are now thriving in their tech careers.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern technology office" 
                className="rounded-2xl shadow-2xl w-full" 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

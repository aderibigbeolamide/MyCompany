import { Link } from "wouter";
import { Linkedin, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/src/assets/logo.png" 
                alt="TechNurture Logo" 
                className="h-8 w-8 object-contain"
              />
              <div className="font-space font-bold text-2xl text-white">
                TechNurture
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering businesses and individuals through innovative technology
              solutions and comprehensive training programs.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services">
                  <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Web Development
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    AI Integration
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Business Automation
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Consultation
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Academy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/academy">
                  <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Web Development Course
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/academy">
                  <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    AI & Machine Learning
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/academy">
                  <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Data Analysis
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/academy">
                  <span className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer">
                    Career Support
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="mr-2">✉</span>
                technature3@gmail.com
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                +234 810-7183-206
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                Abuja, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 TechNurture. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

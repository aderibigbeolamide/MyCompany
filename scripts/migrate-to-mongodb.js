#!/usr/bin/env node

/**
 * MongoDB Migration Script for TechNurture Website
 * 
 * This script migrates data from PostgreSQL to MongoDB and sets up
 * the admin user and sample blog posts.
 */

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://technuture:technutured@technurture.snt0niu.mongodb.net/?retryWrites=true&w=majority&appName=TechNurture';

// MongoDB schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String },
  author: { type: String, required: true },
  authorAvatar: { type: String },
  image: { type: String },
  readTime: { type: String },
  published: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const enrollmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  experience: { type: String, required: true },
  motivation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const dynamicFormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fields: [{ type: mongoose.Schema.Types.Mixed }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const formSubmissionSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'DynamicForm', required: true },
  responses: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const DynamicForm = mongoose.model('DynamicForm', dynamicFormSchema);
const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

async function migrateToMongoDB() {
  try {
    console.log('🚀 Starting MongoDB migration...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await User.findOneAndUpdate(
      { username: 'admin' },
      { 
        username: 'admin', 
        password: hashedPassword, 
        role: 'admin',
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // Create sample blog posts
    console.log('📝 Creating sample blog posts...');
    const blogPosts = [
      {
        title: 'AI & Machine Learning: The Future of Technology',
        content: `<h2>Artificial Intelligence and Machine Learning in 2025</h2>

<p>The landscape of artificial intelligence and machine learning continues to evolve rapidly, offering unprecedented opportunities for businesses and individuals alike.</p>

<img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" alt="AI Machine Learning" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px;" />

<h3>What's New in AI/ML?</h3>
<ul>
<li><strong>Large Language Models:</strong> GPT-4, Claude, and other advanced models are revolutionizing how we interact with technology</li>
<li><strong>Computer Vision:</strong> Enhanced image recognition and processing capabilities</li>
<li><strong>Automated Machine Learning:</strong> Tools that make ML accessible to non-experts</li>
<li><strong>Edge AI:</strong> Running AI models directly on devices for faster processing</li>
</ul>

<h3>Our AI/ML Training Program</h3>
<p>At TechNurture, we offer comprehensive training in:</p>
<ul>
<li>Python programming for AI/ML</li>
<li>Data analysis with pandas and numpy</li>
<li>Machine learning algorithms and frameworks</li>
<li>Deep learning with TensorFlow and PyTorch</li>
<li>Real-world project implementations</li>
</ul>

<p>Whether you're starting your AI journey or looking to advance your skills, our hands-on approach ensures you gain practical experience with industry-standard tools and techniques.</p>`,
        excerpt: 'Explore the latest developments in AI and machine learning, and discover how our comprehensive training program can accelerate your career in this exciting field.',
        category: 'AI & Machine Learning',
        author: 'TechNurture Team',
        readTime: '8 min read',
        published: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Web Development Bootcamp: From Beginner to Professional',
        content: `<h2>Master Modern Web Development</h2>

<p>Our intensive web development bootcamp is designed to take you from complete beginner to job-ready developer in just 12 weeks.</p>

<img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" alt="Web Development" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px;" />

<h3>Complete Full-Stack Curriculum</h3>
<p><strong>Frontend Development:</strong></p>
<ul>
<li>HTML5, CSS3, and responsive design</li>
<li>JavaScript (ES6+) and modern frameworks</li>
<li>React.js with hooks and context</li>
<li>State management with Redux or Zustand</li>
<li>UI libraries like Tailwind CSS and Material-UI</li>
</ul>

<p><strong>Backend Development:</strong></p>
<ul>
<li>Node.js and Express.js</li>
<li>RESTful API design and development</li>
<li>Database management (MongoDB, PostgreSQL)</li>
<li>Authentication and authorization</li>
<li>Server deployment and DevOps basics</li>
</ul>

<h3>Real-World Projects</h3>
<p>Throughout the bootcamp, you'll build:</p>
<ul>
<li>Personal portfolio website</li>
<li>E-commerce application</li>
<li>Social media platform</li>
<li>Task management system</li>
<li>API-integrated mobile-responsive apps</li>
</ul>

<p>By the end of our program, you'll have a strong portfolio and the confidence to apply for junior developer positions or start freelancing.</p>`,
        excerpt: 'Transform your career with our comprehensive 12-week web development bootcamp covering frontend, backend, and everything in between.',
        category: 'Web Development',
        author: 'TechNurture Team',
        readTime: '12 min read',
        published: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Building Your Tech Career: A Complete Roadmap',
        content: `<h2>Your Path to Tech Success</h2>

<p>Breaking into the tech industry can seem daunting, but with the right roadmap and guidance, anyone can build a successful career in technology.</p>

<img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" alt="Tech Career" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px;" />

<h3>Phase 1: Foundation Building</h3>
<ul>
<li><strong>Skill Assessment:</strong> Identify your current skills and interests</li>
<li><strong>Choose Your Path:</strong> Frontend, backend, full-stack, mobile, or specialized roles</li>
<li><strong>Learn the Basics:</strong> Programming fundamentals and computer science concepts</li>
<li><strong>Practice Regularly:</strong> Daily coding practice and problem-solving</li>
</ul>

<h3>Phase 2: Skill Development</h3>
<ul>
<li><strong>Deep Dive:</strong> Master your chosen technology stack</li>
<li><strong>Build Projects:</strong> Create a portfolio of real-world applications</li>
<li><strong>Learn Tools:</strong> Version control, testing, deployment platforms</li>
<li><strong>Understand Systems:</strong> Databases, APIs, cloud services, DevOps</li>
</ul>

<h3>Phase 3: Professional Preparation</h3>
<ul>
<li><strong>Portfolio Development:</strong> Showcase your best work with detailed case studies</li>
<li><strong>Resume Optimization:</strong> Highlight technical skills and achievements</li>
<li><strong>Interview Preparation:</strong> Technical questions, coding challenges, system design</li>
<li><strong>Networking:</strong> Connect with professionals, attend meetups, contribute to open source</li>
</ul>

<h3>Phase 4: Job Search and Growth</h3>
<ul>
<li><strong>Strategic Applications:</strong> Target companies that match your skills and values</li>
<li><strong>Continuous Learning:</strong> Stay updated with industry trends and new technologies</li>
<li><strong>Mentorship:</strong> Find mentors and become one for others</li>
<li><strong>Career Advancement:</strong> Set goals for promotions, salary increases, or role changes</li>
</ul>

<h3>Success Tips</h3>
<p><strong>Be Patient:</strong> Career transitions take time, but consistency pays off.</p>
<p><strong>Stay Curious:</strong> Technology evolves rapidly, so embrace lifelong learning.</p>
<p><strong>Build Community:</strong> Connect with fellow learners and industry professionals.</p>
<p><strong>Celebrate Progress:</strong> Acknowledge your achievements along the way.</p>

<p>At TechNurture, we provide personalized career guidance, technical training, and ongoing support to help you navigate every phase of your tech career journey.</p>`,
        excerpt: 'Navigate your tech career successfully with our comprehensive roadmap covering skill development, portfolio building, and professional growth strategies.',
        category: 'Career Development',
        author: 'TechNurture Team',
        readTime: '10 min read',
        published: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const post of blogPosts) {
      await BlogPost.findOneAndUpdate(
        { title: post.title },
        post,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Sample blog posts created');

    // Create sample dynamic forms
    console.log('📋 Creating sample forms...');
    const sampleForms = [
      {
        title: 'Course Enrollment Application',
        description: 'Apply for our technology training programs',
        fields: [
          { id: 'name', type: 'text', label: 'Full Name', required: true },
          { id: 'email', type: 'email', label: 'Email Address', required: true },
          { id: 'phone', type: 'tel', label: 'Phone Number', required: true },
          { id: 'course', type: 'select', label: 'Course Interest', required: true, options: ['Web Development', 'AI/ML', 'Mobile Development', 'Data Science'] },
          { id: 'experience', type: 'select', label: 'Experience Level', required: true, options: ['Beginner', 'Intermediate', 'Advanced'] },
          { id: 'motivation', type: 'textarea', label: 'Why do you want to join this course?', required: true }
        ],
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Job Application Form',
        description: 'Apply for positions at TechNurture',
        fields: [
          { id: 'name', type: 'text', label: 'Full Name', required: true },
          { id: 'email', type: 'email', label: 'Email Address', required: true },
          { id: 'position', type: 'select', label: 'Position Applied For', required: true, options: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'DevOps Engineer'] },
          { id: 'experience', type: 'number', label: 'Years of Experience', required: true },
          { id: 'portfolio', type: 'url', label: 'Portfolio/GitHub URL', required: false },
          { id: 'cover_letter', type: 'textarea', label: 'Cover Letter', required: true }
        ],
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const form of sampleForms) {
      await DynamicForm.findOneAndUpdate(
        { title: form.title },
        form,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Sample forms created');

    console.log('\n🎉 MongoDB migration completed successfully!');
    console.log('\n📊 Migration Summary:');
    console.log(`👤 Users: ${await User.countDocuments()}`);
    console.log(`📝 Blog Posts: ${await BlogPost.countDocuments()}`);
    console.log(`📞 Contacts: ${await Contact.countDocuments()}`);
    console.log(`🎓 Enrollments: ${await Enrollment.countDocuments()}`);
    console.log(`📋 Forms: ${await DynamicForm.countDocuments()}`);
    console.log(`📊 Submissions: ${await FormSubmission.countDocuments()}`);

    console.log('\n🔐 Admin Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Login URL: http://localhost:5000/admin/login');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToMongoDB();
}

export { migrateToMongoDB };
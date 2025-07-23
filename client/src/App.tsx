import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Academy from "@/pages/academy";
import Blog from "@/pages/blog";
import Contact from "@/pages/contact";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBlog from "@/pages/admin/blog";
import BlogEditor from "@/pages/admin/blog-editor";
import AdminForms from "@/pages/admin/forms";
import FormBuilder from "@/pages/admin/form-builder";
import AdminLogin from "@/pages/admin/login";
import WebDevelopment from "@/pages/services/web-development";
import AIIntegration from "@/pages/services/ai-integration";
import BusinessAutomation from "@/pages/services/business-automation";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Switch>
        {/* Admin Routes (without navbar/footer) */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/blog/new" component={BlogEditor} />
        <Route path="/admin/blog/edit/:id" component={BlogEditor} />
        <Route path="/admin/forms" component={AdminForms} />
        <Route path="/admin/forms/new" component={FormBuilder} />
        <Route path="/admin/forms/edit/:id" component={FormBuilder} />
        
        {/* Public Routes (with navbar/footer) */}
        <Route path="/">
          <>
            <Navbar />
            <main className="flex-1">
              <Home />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        </Route>
        <Route path="/about">
          <>
            <Navbar />
            <main className="flex-1">
              <About />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        </Route>
        <Route path="/services">
          <>
            <Navbar />
            <main className="flex-1">
              <Services />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        </Route>
        <Route path="/academy">
          <>
            <Navbar />
            <main className="flex-1">
              <Academy />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        </Route>
        <Route path="/blog">
          <>
            <Navbar />
            <main className="flex-1">
              <Blog />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        </Route>
        <Route path="/contact">
          <>
            <Navbar />
            <main className="flex-1">
              <Contact />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        </Route>
        
        {/* Service Detail Pages */}
        <Route path="/services/web-development">
          <>
            <Navbar />
            <main className="flex-1">
              <WebDevelopment />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        </Route>
        <Route path="/services/ai-integration">
          <>
            <Navbar />
            <main className="flex-1">
              <AIIntegration />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        </Route>
        <Route path="/services/business-automation">
          <>
            <Navbar />
            <main className="flex-1">
              <BusinessAutomation />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import BlueprintGenerator from './pages/BlueprintGenerator';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminInquiries from './pages/admin/Inquiries';
import AdminProjects from './pages/admin/Projects';
import AdminProjectForm from './pages/admin/ProjectForm';
import AdminServices from './pages/admin/Services';
import AdminPricing from './pages/admin/Pricing';
import AdminSettings from './pages/admin/Settings';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminRouteManagement from './pages/admin/RouteManagement';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import { ScrollToTop } from './components/ScrollToTop';
import { SmoothScrolling } from './components/SmoothScrolling';
import SupportWidget from './components/support/SupportWidget';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
        <Route path="/blueprint" element={<BlueprintGenerator />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/projects/new" element={<AdminProjectForm />} />
            <Route path="/admin/projects/edit/:id" element={<AdminProjectForm />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/pricing" element={<AdminPricing />} />
            <Route path="/admin/inquiries" element={<AdminInquiries />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/route-management" element={<AdminRouteManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background text-primary">
      {!isAdminPath && <div className="fixed inset-0 bg-noise z-0 pointer-events-none"></div>}
      {!isAdminPath && <Navbar />}
      <main className={`flex-grow z-10 relative ${!isAdminPath ? 'mt-24' : ''}`}>
        {children}
      </main>
      {!isAdminPath && <SupportWidget />}
      {!isAdminPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <SmoothScrolling>
        <Router>
          <ScrollToTop />
          <MainLayout>
            <AnimatedRoutes />
          </MainLayout>
        </Router>
      </SmoothScrolling>
    </ThemeProvider>
  );
}

export default App;


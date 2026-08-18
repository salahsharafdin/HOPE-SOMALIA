import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Programs from './pages/public/Programs';
import ProgramDetail from './pages/public/ProgramDetail';
import Projects from './pages/public/Projects';
import ProjectDetail from './pages/public/ProjectDetail';
import Impact from './pages/public/Impact';
import Stories from './pages/public/Stories';
import News from './pages/public/News';
import NewsDetail from './pages/public/NewsDetail';
import GetInvolved from './pages/public/GetInvolved';
import Volunteer from './pages/public/Volunteer';
import Donate from './pages/public/Donate';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import Legal from './pages/public/Legal';
import NotFound from './pages/public/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminAbout from './pages/admin/AdminAbout';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminProjects from './pages/admin/AdminProjects';
import AdminNews from './pages/admin/AdminNews';
import AdminStories from './pages/admin/AdminStories';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminPartners from './pages/admin/AdminPartners';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminDonations from './pages/admin/AdminDonations';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminMessages from './pages/admin/AdminMessages';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminMedia from './pages/admin/AdminMedia';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Guard
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-teal-400 font-bold">Verifying Authentication...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SettingsProvider>
          <Routes>
            {/* Public Website Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:slug" element={<ProgramDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/:slug" element={<Stories />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<Legal />} />
              <Route path="/terms" element={<Legal />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="homepage" element={<AdminHomepage />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="programs" element={<AdminPrograms />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="stories" element={<AdminStories />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="partners" element={<AdminPartners />} />
              <Route path="faq" element={<AdminFAQ />} />
              <Route path="donations" element={<AdminDonations />} />
              <Route path="volunteers" element={<AdminVolunteers />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="documents" element={<AdminDocuments />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="content" element={<Navigate to="/admin/news" replace />} />
              <Route path="finance" element={<Navigate to="/admin/donations" replace />} />
              <Route path="staff" element={<Navigate to="/admin/volunteers" replace />} />
            </Route>
          </Routes>
        </SettingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

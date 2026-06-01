import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import ErrorBoundary from "@/components/ErrorBoundary";
import GlobalStyleQuiz from "@/components/GlobalStyleQuiz";
import ProtectedRoute from "@/components/ProtectedRoute";
import SeoMeta from "@/components/SeoMeta";
import { AdminEditProvider } from "@/components/AdminBar";
import Home from "@/pages/Home";
import RatesPage from "@/pages/RatesPage";
import StylingPage from "@/pages/StylingPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfUse from "@/pages/TermsOfUse";
import SizeGuide from "@/pages/SizeGuide";
import BookingPolicy from "@/pages/BookingPolicy";
import FAQPage from "@/pages/FAQPage";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminRegister from "@/pages/admin/AdminRegister";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminEmails from "@/pages/admin/AdminEmails";
import AdminConsultations from "@/pages/admin/AdminConsultations";
import ContactPage from "@/pages/ContactPage";
import LookbookPage from "@/pages/LookbookPage";

export default function App() {
  return (
    <ErrorBoundary>
      <AdminEditProvider>
        <ScrollToTop />
        <SeoMeta />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/rates" element={<RatesPage />} />
          <Route path="/stories/:category" element={<Navigate to="/lookbook" replace />} />
          <Route path="/styling/:type" element={<StylingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/booking-policy" element={<BookingPolicy />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/lookbook" element={<LookbookPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/emails"
            element={
              <ProtectedRoute>
                <AdminEmails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/consultations"
            element={
              <ProtectedRoute>
                <AdminConsultations />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <GlobalStyleQuiz />
      </AdminEditProvider>
    </ErrorBoundary>
  );
}

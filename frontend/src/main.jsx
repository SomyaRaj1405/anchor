import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/fraunces/600.css";
import "./tokens.css";
import "./shell.css";
import "./home.css";
import "./polish.css";
import "./styles.css";
import "./auth.css";
import AppShell from "./components/AppShell";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import EvidencePage from "./pages/EvidencePage";
import TransitionPage from "./pages/TransitionPage";
import DiagnosePage from "./pages/DiagnosePage";
import SimulatePage from "./pages/SimulatePage";
import AuditPage from "./pages/AuditPage";
import OntologyPage from "./pages/OntologyPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import LegalPage from "./pages/LegalPage";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route
              path="/evidence"
              element={
                <ProtectedRoute allowedRoles={["candidate", "employer", "reviewer"]}>
                  <EvidencePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transition"
              element={
                <ProtectedRoute allowedRoles={["candidate", "reviewer"]}>
                  <TransitionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diagnose"
              element={
                <ProtectedRoute allowedRoles={["candidate", "reviewer"]}>
                  <DiagnosePage />
                </ProtectedRoute>
              }
            />
            <Route path="/diagnostic" element={<Navigate to="/diagnose" replace />} />
            <Route
              path="/simulate"
              element={
                <ProtectedRoute allowedRoles={["employer", "reviewer"]}>
                  <SimulatePage />
                </ProtectedRoute>
              }
            />
            <Route path="/lab" element={<Navigate to="/simulate" replace />} />
            <Route
              path="/audit"
              element={
                <ProtectedRoute allowedRoles={["reviewer", "employer"]}>
                  <AuditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute allowedRoles={["candidate", "employer", "reviewer"]}>
                  <AboutPage />
                </ProtectedRoute>
              }
            />
            <Route path="/methodology" element={<Navigate to="/about" replace />} />
            <Route
              path="/ontology"
              element={
                <ProtectedRoute allowedRoles={["candidate", "employer", "reviewer"]}>
                  <OntologyPage />
                </ProtectedRoute>
              }
            />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

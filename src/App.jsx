import React from "react";
import { PinProvider, usePins } from "./context/PinContext";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { CategoryBar } from "./components/CategoryBar";
import { MasonryGrid } from "./components/MasonryGrid";
import { AdminPanel } from "./components/AdminPanel";
import { AdminAuthModal } from "./components/AdminAuthModal";
import { AuthModal } from "./components/AuthModal";
import { SupabaseSettingsModal } from "./components/SupabaseSettingsModal";
import { PinDetailModal } from "./components/PinDetailModal";
import { UploadModal } from "./components/UploadModal";
import { CloudinarySettingsModal } from "./components/CloudinarySettingsModal";
import { UserProfileModal } from "./components/UserProfileModal";
import { BoardView } from "./components/BoardView";
import { ToastContainer } from "./components/Toast";
import { Footer } from "./components/Footer";

const MainContent = () => {
  const { activeView } = usePins();

  return (
    <div className="app-container">
      {/* Ambient background glow */}
      <div className="ambient-glow" />

      <Navbar />
      
      {activeView === "gallery" && (
        <>
          <HeroBanner />
          <CategoryBar />
        </>
      )}
      
      <main className="main-content">
        {activeView === "gallery" && <MasonryGrid />}
        {activeView === "admin" && <AdminPanel />}
        {activeView === "board" && <BoardView />}
      </main>

      <Footer />

      {/* Interactive, Security & Auth Modals */}
      <AuthModal />
      <AdminAuthModal />
      <PinDetailModal />
      <UploadModal />
      <UserProfileModal />
      <ToastContainer />

      {/* Backend Infrastructure Modals (Owner/Admin Only) */}
      {isAdminAuthenticated && (
        <>
          <SupabaseSettingsModal />
          <CloudinarySettingsModal />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PinProvider>
      <MainContent />
    </PinProvider>
  );
}

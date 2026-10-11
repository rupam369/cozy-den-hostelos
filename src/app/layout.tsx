import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import CozyAssistantWidget from '@/components/chat/CozyAssistantWidget';
import NotificationToasts from '@/components/notifications/NotificationToasts';

export const metadata: Metadata = {
  title: 'COZY DEN — Digital Hostel Sanctuary',
  description: 'An immersive digital hostel experience fusing Apple Vision Pro spatial elegance, warm hostel lights, real 3D digital twin architecture, and smart campus living.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className="min-h-full flex flex-col bg-[#040711] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 antialiased">
        <AppProvider>
          {/* Spatial Warm Hostel Ambient Lights */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Top right warm lantern glow */}
            <div className="absolute -top-32 right-1/4 h-[550px] w-[550px] rounded-full bg-amber-500/[0.07] blur-[160px]" />
            {/* Mid deep navy indigo glow */}
            <div className="absolute top-1/2 -left-32 h-[700px] w-[700px] rounded-full bg-blue-600/[0.05] blur-[180px]" />
            {/* Bottom warm copper glow */}
            <div className="absolute -bottom-32 right-10 h-[600px] w-[600px] rounded-full bg-orange-600/[0.04] blur-[150px]" />
          </div>

          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* Real-time Animated Notification Toasts */}
            <NotificationToasts />
            {/* Global Floating AI Hostel Concierge */}
            <CozyAssistantWidget isFullPage={false} />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

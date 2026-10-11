import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import CozyAssistantWidget from '@/components/chat/CozyAssistantWidget';
import NotificationToasts from '@/components/notifications/NotificationToasts';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'COZY DEN — Real 3D Hostel Digital Experience Platform',
  description: 'A futuristic, premium, multi-layer hostel management platform combining Apple Vision Pro spatial UI, smart building IoT metrics, modern mess systems, and nostalgic hostel soul.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white antialiased">
        <AppProvider>
          {/* Spatial Ambient Background Lights */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[140px]" />
            <div className="absolute top-1/3 -right-40 h-[700px] w-[700px] rounded-full bg-purple-600/10 blur-[150px]" />
            <div className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[130px]" />
          </div>

          <div className="relative z-10 flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 px-4 py-4">{children}</main>
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

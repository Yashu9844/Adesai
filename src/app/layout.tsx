import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PWARegistrar } from "@/components/pwa/PWARegistrar";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Sri Sai Baba Tool Rental",
  description: "Manage tool inventory, rentals, and returns from any device.",
  applicationName: "Sri Sai Baba Tool Rental",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tool Rental",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} text-slate-900 relative min-h-[100dvh] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] selection:bg-fuchsia-200 selection:text-fuchsia-900`}>
        <PWARegistrar />
        
        {/* Premium Ambient Glassmorphism Mesh Background */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#fdfdff]">
          <div className="absolute top-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-violet-400/20 blur-[100px]" />
          <div className="absolute top-[30%] right-[-20%] w-[350px] h-[350px] rounded-full bg-rose-400/15 blur-[100px]" />
          <div className="absolute bottom-[0%] left-[10%] w-[500px] h-[500px] rounded-full bg-teal-300/20 blur-[120px]" />
        </div>
        
        {children}
      </body>
    </html>
  );
}

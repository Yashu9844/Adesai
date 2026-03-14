import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tool Rental App",
  description: "Manage tool inventory and rentals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} text-slate-900 relative min-h-screen selection:bg-fuchsia-200 selection:text-fuchsia-900`}>
        
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

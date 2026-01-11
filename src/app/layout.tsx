import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pull-Up Mastery",
  description: "4-Week Pull-Up Training Program",
  icons: {
    icon: "/header-illustration.png",
    apple: "/header-illustration.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zero to Hero",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-background" />

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Large blurred circles for depth */}
          <div className="absolute top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-[#ff477e]/5 rounded-full blur-3xl animate-float-slower" />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-white/8 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 -right-32 w-72 h-72 bg-[#ff9eb5]/8 rounded-full blur-3xl animate-float" />

          {/* Medium decorative shapes with gradients */}
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-3xl rotate-12 animate-float" />
          <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-[#ff477e]/10 to-transparent rounded-full animate-float-slower" />
          <div className="absolute top-2/3 right-1/2 w-28 h-28 bg-gradient-to-tl from-white/15 to-transparent rounded-2xl -rotate-12 animate-float-slow" />

          {/* Outlined shapes for variety */}
          <div className="absolute top-1/4 left-1/2 w-16 h-16 border-2 border-white/20 rounded-2xl rotate-45 animate-float" />
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 border-2 border-[#ff477e]/15 rounded-full animate-float-slow" />
          <div className="absolute top-1/2 left-1/3 w-12 h-12 border border-white/25 rounded-xl -rotate-6 animate-float-slower" />

          {/* Small circles scattered around */}
          <div className="absolute top-1/5 right-1/5 w-8 h-8 bg-white/15 rounded-full blur-sm animate-float-slow" />
          <div className="absolute bottom-1/5 left-1/5 w-6 h-6 bg-[#ff477e]/20 rounded-full blur-sm animate-float" />
          <div className="absolute top-3/4 right-2/3 w-10 h-10 bg-white/12 rounded-full blur-md animate-float-slower" />

          {/* Sparkle/star elements */}
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/40 rounded-full animate-pulse" />
          <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-[#ff477e]/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-1/2 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/2 left-2/3 w-2 h-2 bg-[#ff9eb5]/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />

          {/* Diagonal accent lines */}
          <div className="absolute top-0 left-1/3 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent rotate-12 animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-px h-40 bg-gradient-to-b from-transparent via-[#ff477e]/10 to-transparent -rotate-12 animate-float" />
        </div>

        <main className="min-h-screen relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}

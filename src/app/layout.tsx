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

        <main className="min-h-screen relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}

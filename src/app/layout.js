import "./globals.css";
import { AuthProvider } from "./provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Admin Dashboard",
  description:
    "Comprehensive admin dashboard for managing products, orders, and analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

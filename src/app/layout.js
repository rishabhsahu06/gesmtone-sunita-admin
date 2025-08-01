import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./provider";
import { Toaster } from "@/components/ui/toaster";

// Load fonts
const inter = Inter({ subsets: ["latin"] });
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "Admin Dashboard",
  description:
    "Comprehensive admin dashboard for managing products, orders, and analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

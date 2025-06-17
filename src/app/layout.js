import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./provider"
import { Toaster } from "@/components/ui/toaster"
// import { ToastContainer } from "react-toastify"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Admin Dashboard",
  description: "Comprehensive admin dashboard for managing products, orders, and analytics",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
       <Toaster/>

          {children}
       {/* </Toaster> */}
        </AuthProvider>
      </body>
    </html>
  )
}

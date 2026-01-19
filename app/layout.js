import { Inter } from "next/font/google";
import { AuthProvider } from "./context/auth-context";
import { CartProvider } from "./context/cart-context";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import "./_styles/globals.css";
import { ToastProvider } from "./context/toast-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StorePro - Modern E-Commerce",
  description: "Clean, modern e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

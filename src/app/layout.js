import ClientProviders from "@/components/providers/ClientProviders";
import SmoothScroll from "@/components/smoothScroll";
import { El_Messiri, Heebo } from "next/font/google"; // Removed unused Geist completely to prevent eslint errors
import { Toaster } from "react-hot-toast";
import "../scss/main.scss";
import "./globals.css";
import "react-phone-input-2/lib/style.css";

const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin"],
  weight: ["400", "600", "500", "700", "800"],
});

export const metadata = {
  title: "Glamolic AI",
  description: "Glamolic AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${elMessiri.variable} ${heebo.variable}`}>
        <ClientProviders>
          <Toaster position="bottom-right" />
          <SmoothScroll>{children}</SmoothScroll>
        </ClientProviders>
      </body>
    </html>
  );
}

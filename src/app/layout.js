import { El_Messiri, Geist, Geist_Mono, Heebo } from "next/font/google";
import "./globals.css";
import '../scss/main.scss';
import SmoothScroll from '@/components/smoothScroll';

const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin"],
  weight: ["400", "600", "500", "700", "800"]
});

export const metadata = {
  title: "Glamolic AI",
  description: "Glamolic AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${elMessiri.variable} ${heebo.variable}`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit ({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
})

export const metadata = {
  title: { default: "Neurao - Compléments alimentaires naturels", template: "%s | Neurao"},
  description: "Neurao propose des compléments alimentaires naturels, sans additif ni excipient. Des formules simples, livrées en France, Belgique, Suisse et Luxembourg.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}

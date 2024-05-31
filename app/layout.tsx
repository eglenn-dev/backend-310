import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderNav from "./components/HeaderNav";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "3D Print Request - The Mac Lab | McKay Library",
    description: "3D Print request system for the Mac Lab at McKay Library.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <HeaderNav />
                {children}
                <Footer />
            </body>
        </html>
    );
}

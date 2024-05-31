import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SideNav from '@/components/ui/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'VisionarAI',
    description: 'Playground for huggingface models with Transofrmers.js',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gradient-to-tr from-teal-100 to-lime-50 flex`}>
                <SideNav />
                {children}
            </body>
        </html>
    );
}

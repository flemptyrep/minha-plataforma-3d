import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header'; 
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: '3DVault | Modelos 3D Testados',
  description: 'A maior biblioteca comunitária de ficheiros STL e 3MF validados.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT"> 
      <body className="bg-gray-950 text-white min-h-screen flex flex-col font-sans">
        <LanguageProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
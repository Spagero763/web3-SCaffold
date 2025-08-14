import type { Metadata } from 'next';
import './globals.css';
import { Web3Provider } from '@/providers/web3-provider';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MainNav } from '@/components/main-nav';

export const metadata: Metadata = {
  title: 'Web3 Scaffold',
  description: 'Scaffold for building Web3 applications',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Web3Provider>
          <SidebarProvider>
            <MainNav />
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-2">
                    {/* Placeholder for breadcrumbs or page title if needed */}
                </div>
                <div className="ml-auto">
                  <ConnectButton />
                </div>
              </header>
              <main className="min-h-[calc(100vh-4rem)] w-full">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}

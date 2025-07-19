import type { Metadata } from "next";
import { headers } from 'next/headers'
import { UIProvider } from "@/components/ui/provider";
import ContextProvider from '../../context'

export const metadata: Metadata = {
  title: "Plume Fullstack Exercise",
  description: "Fullstack developer exercise",
  icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Retrieve cookies from request headers on the server for AppKit
  const headersObj = await headers()
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ContextProvider cookies={cookies}>
          <UIProvider>{children}</UIProvider>
        </ContextProvider>
      </body>
    </html>
  );
}

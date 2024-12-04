import { ThemeProvider } from "@/components/core/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/lib/query-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nebulaform",
  authors: [{ name: "Renato Filipi" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          defer></script> */}
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <div>{children}</div>
            <Toaster richColors expand position="bottom-right" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

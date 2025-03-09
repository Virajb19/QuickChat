import "~/styles/globals.css";

import { type Metadata } from "next";
import { Space_Grotesk } from 'next/font/google';
import Providers from "./providers";
import NextTopLoader from 'nextjs-toploader';

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/components/Navbar";
import { GridBackgroundDemo } from "~/components/GridBG";

export const metadata: Metadata = {
  title: "Quick Chat",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
});


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${grotesk.className} antialiased`} suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Providers>
           <Navbar />
           <NextTopLoader height={4} color="#38bdf8" showSpinner={false} easing="ease"/>
           <TRPCReactProvider>{children}</TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
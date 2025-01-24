import NextTopLoader from 'nextjs-toploader';
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";

const poppinsVariable = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsVariable.className} antialiased`}>
        <Providers>
          <NextTopLoader
            color="#ffffff"
            initialPosition={0.08}
            crawlSpeed={200}
            height={1}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            zIndex={1600}
          />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

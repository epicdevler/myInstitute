import { Provider } from "@/app/components/ui/provider";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  

  return (
    <html lang="en">
      <body>
        <Provider storageKey="myInstitute">{children}</Provider>
        <NextTopLoader color="orange" />
      </body>
    </html>
  );
}

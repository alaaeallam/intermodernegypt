import "./globals.css";
import { ViewTransitions } from "next-view-transitions";

import Nav from "@/components/Nav";

export const metadata = {
  title: "Inter Modern Contracting",
  description: "Inter Modern Contracting IMC Egypt",
};

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body>
          <Nav />
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "kindred_ | Meet through moments", description: "A more thoughtful way to meet people." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

import type { Metadata } from "next";
import "./globals.css";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@/theme/theme";


export const metadata: Metadata = {
  title: "Lemons' Insurance App",
  description: "For local record-keeping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <body>
          <CssBaseline/>
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}

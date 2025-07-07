import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,  
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import DefaultLayout from "./layouts/DefaultLayout";
import {} from 'dotenv/config'
import CookieConsent from "./components/cookieconsent";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HF4YBP05QE"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HF4YBP05QE', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        <DefaultLayout>
          {children}
          <CookieConsent />
          <ScrollRestoration />
          <Scripts />
        </DefaultLayout>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,  
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import DefaultLayout from "./layouts/DefaultLayout"; // Poprawny import layoutu
import { getUserSession } from "./utils/auth.server";
import { db } from './services/index';  // Adjust path accordingly
import { json, LoaderFunction, redirect } from "@remix-run/node";

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

export const loader: LoaderFunction = async ({ request }) => {
  const sessionData = await getUserSession(request);

  if (!sessionData || !sessionData.userId) {
    return { userId: null, isAdmin: false };
  }

  const user = await db.user.findUnique({
    where: { id: sessionData.userId },
  });

  if (!user) {
    return { userId: null, isAdmin: false };
  }

  return { userId: sessionData.userId, isAdmin: user.isAdmin };
};

export function Layout({ children }: { children: React.ReactNode }) {
  
  let userId = null;
  let isAdmin = false;
  
  const user = { userId, isAdmin } = useLoaderData() || { userId: null, isAdmin: false };

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
        <script src="https://geowidget.easypack24.net/js/sdk-for-javascript.js"></script>
      </head>
      <body>
        <DefaultLayout userId={user.userId} isAdmin={user.isAdmin}>
          {children}
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

import React, { useState, useEffect } from "react";
import { ActionFunction, json, LoaderFunction, redirect, V2_MetaFunction } from '@remix-run/node';
import { useActionData, Link, useLocation, Form } from "@remix-run/react";

import { authenticator } from "../utils/auth.server";
import { Textfield } from '../components/textfield';
import { sessionStorage } from "../utils/session.server";
import { prisma } from "../utils/prisma.server";
import bcrypt from "bcryptjs";


export const meta: V2_MetaFunction = () => {
  return [{ title: "Zaloguj się - Artysta Zdrowia" }];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    console.log("userId from session:", userId);

    if (userId) {
      return redirect("/");
    }
    
    return null;
  } catch (error) {
    console.error("Loader error:", error);
    return redirect("/login");
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return json({ error: "Nieprawidłowy email lub hasło" }, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return json({ error: "Nieprawidłowy email lub hasło" }, { status: 401 });
    }

    const session = await sessionStorage.getSession();
    session.set("userId", user.id);
    session.set("email", user.email);
    session.set("isAdmin", user.isAdmin)

    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return json({ error: "Coś poszło nie tak podczas logowania" }, { status: 500 });
  }
};

export default function Login() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message");

  const actionData = useActionData();

  const user = actionData?.user;

  console.log("actionData:", actionData);
  console.log("Authenticated user:", user);

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || '',
    password: actionData?.fields?.password || '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData(form => ({ ...form, [field]: event.target.value }));
  };

  useEffect(() => {
    if (user) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <div className="h-screen">
      <div className="h-4/5 justify-center items-center flex flex-col">
        {actionData?.error && (
            <div className="bg-red-200 p-4 rounded-xl">
              <p className="text-red-700">{actionData.error}</p>
            </div>
          )}
        {message && (
          <div className="bg-green-200 p-4 rounded-xl">
            <p className="text-green-700">{message}</p>
          </div>
        )}
        <Form method="POST" className="px-6 py-2 w-96">
          <h2 className="text-3xl pb-6 text-black font-light tracking-widest text-center">
            Zaloguj się
          </h2>
          <Textfield
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={e => handleInputChange(e, 'email')}
            required
          />
          <Textfield
            htmlFor="password"
            type="password"
            label="Hasło"
            value={formData.password}
            onChange={e => handleInputChange(e, 'password')}
            required
          />
          <div className="w-full text-center pt-4 px-28">
            <button 
              type="submit" 
              name="_action" 
              value="Sign In" 
              className="ring-1 ring-black rounded-sm mt-3 px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-slate-100 hover:text-slate-800"
            >
              Zaloguj się
            </button>
          </div>
        </Form>
        <p className="px-2 pt-1">
          Nie masz jeszcze konta?
        </p>
        <Link to="/register" className="group transition duration-300 ease-in-out hover:text-slate-600 px-2 py-1">
            Zarejestruj się
        </Link>
      </div>
    </div>
  );
}

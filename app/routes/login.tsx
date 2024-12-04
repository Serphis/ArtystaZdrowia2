import React, { useState, useEffect } from "react";
import { ActionFunction, json, LoaderFunction, redirect, V2_MetaFunction } from '@remix-run/node';
import { useActionData, Link, useLocation, Form } from "@remix-run/react";

import { authenticator } from "../utils/auth.server";
import { Textfield } from '../components/textfield';
import { sessionStorage } from "../utils/session.server"; // zaimportowanie sessionStorage
import { prisma } from "../utils/prisma.server";
import bcrypt from "bcryptjs";


export const meta: V2_MetaFunction = () => {
  return [{ title: "Zaloguj się - Artysta Zdrowia" }];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    // Sprawdzanie, czy użytkownik jest zalogowany na podstawie sesji
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    console.log("userId from session:", userId); // Logowanie userId

    if (userId) {
      return redirect("/"); // Jeśli użytkownik jest zalogowany
    }
    
    return null; // Jeśli użytkownik nie jest zalogowany, pozwól na dostęp do logowania
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
    // Pobierz użytkownika z bazy danych na podstawie emaila
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return json({ error: "Nieprawidłowy email lub hasło" }, { status: 401 });
    }

    // Porównaj hasło z zahashowanym hasłem w bazie danych
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return json({ error: "Nieprawidłowy email lub hasło" }, { status: 401 });
    }

    // Tworzenie sesji po poprawnym logowaniu
    const session = await sessionStorage.getSession();
    session.set("userId", user.id);
    session.set("email", user.email);

    // Zwróć ciasteczko sesji wraz z przekierowaniem
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

  const user = actionData?.user; // Upewnij się, że user jest poprawnie przypisany

  console.log("actionData:", actionData);
  console.log("Authenticated user:", user); // Sprawdź dane użytkownika

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || '',
    password: actionData?.fields?.password || '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData(form => ({ ...form, [field]: event.target.value }));
  };

  useEffect(() => {
    if (user) {
      window.location.href = "/"; // Przekierowanie na stronę główną, jeśli użytkownik jest zalogowany
    }
  }, [user]);

  return (
    <div className="h-full justify-center bg-yellow-100 items-center flex flex-col gap-y-5">
       {actionData?.error && (
          <div className="bg-red-200 p-4 rounded-xl mb-4">
            <p className="text-red-700">{actionData.error}</p>
          </div>
        )}
       {message && (
        <div className="bg-green-200 p-4 rounded-xl mb-4">
          <p className="text-green-700">{message}</p>
        </div>
      )}
      <Form method="POST" className="rounded-2xl bg-white p-6 w-96">
        <h2 className="text-3xl font-extrabold text-black-600 mb-5">Login</h2>
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
        <div className="w-full text-center mt-5">
          <button 
            type="submit" 
            name="_action" 
            value="Sign In" 
            className="w-full rounded-xl mt-2 bg-red-500 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-red-600"
          >
            Zaloguj się
          </button>
        </div>
      </Form>
      <p className="text-gray-600">Nie masz jeszcze konta?<Link to="/register"><span className="text-red-600 px-2 underline">Zarejestruj się</span></Link></p>
    </div>
  );
}

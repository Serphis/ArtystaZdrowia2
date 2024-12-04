import React, { useState } from "react";
import type { V2_MetaFunction } from "@remix-run/node";
import { ActionFunction, json, redirect } from '@remix-run/node';
import { useActionData, Link } from "@remix-run/react";

import { authenticator } from "../utils/auth.server";
import { createUser } from "../utils/user.server";
import { Textfield } from '../components/textfield';

// Ustawienie metadanych strony
export const meta: V2_MetaFunction = () => {
  return [{ title: "Zarejestruj się - Artysta Zdrowia" }];
};

// Funkcja action zajmująca się rejestracją użytkownika
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  const name = form.get("name");

  // Walidacja danych
  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    return json({ error: "Nieprawidłowe dane", form: action }, { status: 400 });
  }

  // Sprawdzamy poprawność emaila (np. format emaila)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ error: "Nieprawidłowy adres email" }, { status: 400 });
  }

  // Sprawdzamy, czy hasło ma co najmniej 8 znaków
  if (password.length < 8) {
    return json({ error: "Hasło musi posiadać co najmniej 8 znaków" }, { status: 400 });
  }

  await createUser({ email, password, name });

  // Jeśli utworzenie użytkownika się powiedzie, próbujemy zalogować użytkownika
  return redirect("/login?message=Rejestracja%20zako%C5%84czona%20sukcesem%2C%20mo%C5%BCesz%20si%C4%99%20zalogowa%C4%87");
};

export default function Register() {
  const actionData = useActionData();
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || '',
    password: actionData?.fields?.password || '',
    name: actionData?.fields?.name || '', // Użyj 'name' zamiast 'password'
  });

  // Obsługa zmian w formularzu
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData(form => ({ ...form, [field]: event.target.value }));
  };

  return (
    <div className="h-screen bg-[#f2e4ca]">
      <div className="h-4/5 justify-center items-center flex flex-col">
        <form method="POST" className="px-6 py-2 w-96">
          <h2 className="text-3xl pb-6 text-[#584d48] font-light tracking-widest text-center">
            Stwórz konto
          </h2>
          <Textfield
            htmlFor="name"
            type="text"
            label="Imię"
            value={formData.name}
            onChange={e => handleInputChange(e, 'name')}
            required
          />
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
          <div className="w-full text-center pt-4 px-16">
            <button type="submit" name="_action" value="Sign Up" className="w-full rounded-sm mt-3 px-3 py-2 font-semibold transition duration-300 ease-in-out bg-[#7b6b63] hover:bg-[#fbf7ed] text-[#fbf7ed] hover:text-[#7b6b63]">
              Stwórz konto
            </button>
          </div>
        </form>
        <p className="text-[#7b6b63] px-2 pt-1">
          Masz już konto?
        </p>
        {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
          <Link to="/login" className="group transition duration-300 ease-in-out text-[#7b6b63] hover:text-[#9a867c] px-2">
            Zaloguj się
          </Link>
      </div>
    </div>
  );
}
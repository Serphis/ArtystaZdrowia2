import { Authenticator } from "remix-auth";
import { getUserFromSession, sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";
import { redirect } from "@remix-run/node";

// Inicjalizacja sessionStorage i authenticator
const authenticator = new Authenticator<any>(sessionStorage);

export async function getUserSession(request: Request) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    const isAdmin = session.get("isAdmin");

    if (userId !== null) {
      return { userId, isAdmin };
    }
    else {
      return null;
    }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new Error("Błąd bazy danych");
  }
}

export async function comparePassword(inputPassword: string, storedPassword: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Błąd przy porównywaniu haseł");
  }
}

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordsMatch = await comparePassword(password, user.password as string);

  if (!passwordsMatch) {
    throw new Error("Invalid email or password");
  }

  const session = await sessionStorage.getSession();
  session.set("userId", user.id);

  return session;
});

authenticator.use(formStrategy, "form");

export async function requireAdmin(request: Request) {
  const userSession = await getUserSession(request);

  if (!userSession || !userSession.userId || userSession.isAdmin !== true) {
    console.error("Unauthorized access attempt or invalid session");
    throw redirect('/login');
  }

  return userSession;
}

export async function checkAdmin(request: Request) {
  const userSession = await getUserSession(request);

  if (userSession && userSession.userId && userSession.isAdmin === true) {
    return true;
  }

  return false;
}


export { authenticator };
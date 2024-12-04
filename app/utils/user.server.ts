import bcrypt from 'bcryptjs'
import type { RegisterForm } from './types.server'
import { prisma } from './prisma.server'
import { getUserFromSession } from "./session.server"; // Jeśli masz funkcję pobierającą użytkownika z sesji

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 12)
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      name: user.name
    },
  })
  return { id: newUser.id, email: user.email, name: user.name }
}

export async function getUserStatus(request: Request) {
  try {
    const user = await getUserFromSession(request); // Pobieramy użytkownika z sesji
    return { isAuthenticated: !!user };
  } catch (error) {
    console.error(error);
    return { isAuthenticated: false };
  }
}
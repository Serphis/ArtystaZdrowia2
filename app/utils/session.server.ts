import { createCookieSessionStorage } from "@remix-run/node";
import { db } from "../services/index";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  },
});

export function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export function commitSession(session: any) {
  return sessionStorage.commitSession(session);
}

export async function getUserFromSession(request: Request) {
  const session = await getSession(request);
  const user = session.get("user");
  if (!user) return null;
  return user;
}

export async function createUserSession(user: any, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("user", user);
  return new Response(null, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
      Location: redirectTo,
    },
    status: 302,
  });
}

export async function destroyUserSession(request: Request) {
  const session = await getSession(request);
  return new Response(null, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function addToCart(session: any, productId: string, quantity: number, sizeId: string, price: number) {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { name: true, image: true },
  });

  const cart: Record<string, { quantity: number; name: string; image: string; sizeId: string; price: number }> = session.get("cart") || {};

  const productKey = `${productId}-${sizeId}`;  // np. "123-1" (gdzie 123 to productId, a 1 to sizeId)

  if (cart[productKey]) {
    cart[productKey].quantity += quantity;
  } else {
    cart[productKey] = { quantity, name: product.name, image: product.image, sizeId, price };
  }

  session.set("cart", cart);
}


export async function removeFromCart(session: Session, productId: string, sizeId: string) {
  const cart = session.get("cart") || [];
  
  const uniqueKey = `${productId}-${sizeId}`;

  const updatedCart = cart.filter((item: any) => `${item.productId}-${item.sizeId}` !== uniqueKey);
  
  session.set("cart", updatedCart);
}



export { sessionStorage };

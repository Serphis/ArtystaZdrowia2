import { ActionFunction, redirect } from "@remix-run/node";
import { sessionStorage } from "../utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  session.unset("userId");
  session.unset("email");
  
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

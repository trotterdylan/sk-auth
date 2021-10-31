'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

async function signOut() {
  let res = await fetch("/api/auth/signout", { method: "POST" });
  const { signout } = await res.json();
  if (!signout) {
    throw new Error("Sign out not successful!");
  }
  res = await fetch("/api/auth/session");
  const session = await res.json();
  return session;
}

exports.signOut = signOut;
//# sourceMappingURL=signOut.js.map

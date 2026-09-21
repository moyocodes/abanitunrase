import { auth } from "@/firebase/config";

async function callManageAdmin(action, payload = {}) {
  if (!auth?.currentUser) throw new Error("Not signed in");
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch("/api/manage-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function listAdmins() {
  return callManageAdmin("list").then((d) => d.admins ?? []);
}

export function grantAdmin(email) {
  return callManageAdmin("grant", { email });
}

export function revokeAdmin(email) {
  return callManageAdmin("revoke", { email });
}

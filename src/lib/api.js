"use client";
import { authClient } from "./auth-client";

const BASE = process.env.NEXT_PUBLIC_API_URL;
let cache = { token: null, exp: 0 };

export const resetToken = () => (cache = { token: null, exp: 0 });

async function getToken() {
  if (cache.token && Date.now() < cache.exp) return cache.token;
  const { data } = await authClient.token();
  if (!data?.token) return null;
  cache = { token: data.token, exp: Date.now() + 4 * 60 * 1000 };
  return cache.token;
}

// Calls the Express API. Attaches the Better Auth JWT unless auth:false.
export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const t = await getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) resetToken();
    throw Object.assign(new Error(json.message || "Something went wrong"), { status: res.status, code: json.code });
  }
  return json;
}

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Image upload failed");
  return json.url;
}

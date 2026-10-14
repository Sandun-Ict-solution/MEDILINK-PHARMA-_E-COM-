export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try { response = await fetch(`${API_URL}${path}`, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers }, cache: "no-store" }); }
  catch { throw new Error("Unable to reach MEDILINK API. Check that backend is running, MongoDB is reachable and NEXT_PUBLIC_API_URL points to http://localhost:4000/api."); }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 429) throw new Error("Too many login attempts. Wait a few minutes before trying again.");
    if (response.status === 503) throw new Error(payload.error || "MEDILINK database or service is temporarily unavailable. Please retry shortly.");
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  return payload as T;
}
export const post = <T = any>(path: string, data: unknown) => api<T>(path, { method: "POST", body: JSON.stringify(data) });

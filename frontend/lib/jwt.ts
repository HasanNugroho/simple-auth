export function decodeJWTPayload(token: string | undefined) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payloadBase64 = parts[1];
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

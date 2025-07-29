import { NextResponse } from "next/server";
import api from "@/lib/api";
import { SignInSchema } from "@/app/api/auth/definitions";
import { decodeJWTPayload } from "@/lib/jwt";
import { AxiosError } from "axios";

function isAxiosError(
  error: unknown
): error is AxiosError<{ message?: string }> {
  return (error as AxiosError).isAxiosError === true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SignInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Email & password wajib diisi" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const res = await api.post("/auth/login", { email, password });
    const { token } = res.data.data;

    // Decode token payloads to extract expiration
    const accessPayload = decodeJWTPayload(token);

    const now = Math.floor(Date.now() / 1000);
    const accessMaxAge = accessPayload?.exp ? accessPayload.exp - now : 60 * 15;
    console.log(token);

    // Get user data
    const meRes = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = meRes.data.data;

    // Create response and set cookies
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        email: userData.email,
        name: userData.name,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: accessMaxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch (error: unknown) {
    console.error(error);

    const message = isAxiosError(error)
      ? error.response?.data?.message || "Email atau password salah"
      : "Terjadi kesalahan, coba lagi nanti";

    return NextResponse.json({ message }, { status: 401 });
  }
}

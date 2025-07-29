import { NextResponse } from "next/server";
import api from "@/lib/api";
import { SignUpSchema } from "../definitions";
import { AxiosError } from "axios";

function isAxiosError(
  error: unknown
): error is AxiosError<{ message?: string }> {
  return (error as AxiosError).isAxiosError === true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = SignUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, name, password } = parsed.data;

    // Send register request to backend API
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Registration successful",
        data: res.data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[REGISTER_ERROR]", error);

    let msg = "Failed to register";
    if (isAxiosError(error)) {
      msg = error.response?.data?.message || msg;
    } else if (error instanceof Error) {
      msg = error.message;
    }

    return NextResponse.json({ message: msg }, { status: 403 });
  }
}

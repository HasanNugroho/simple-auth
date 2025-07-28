"use client";

import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignInSchema } from "../api/auth/definitions";

export default function Page() {
  const router = useRouter();

  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = SignInSchema.safeParse({ email, password });

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.message || "Login Gagal");
        return;
      }

      await res.json();
      router.push("/");
    } catch (error) {
      console.error("[LOGIN_ERROR]", error);
      setFormError("Terjadi kesalahan, coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          onSubmit={handleSubmit}
          errors={fieldErrors}
          isLoading={isLoading}
          formError={formError}
        />
      </div>
    </div>
  );
}

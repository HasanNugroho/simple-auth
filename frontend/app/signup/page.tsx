"use client";

import { SignUpForm } from "@/components/sign-up-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "../api/auth/definitions";

export default function Page() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    identifier?: string[];
    password?: string[];
  }>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const result = SignUpSchema.safeParse({
      name,
      email,
      password,
    });

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Panggil API route untuk Register
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.message || "Register failed");
        return;
      }

      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("[LOGIN_ERROR]", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm
          onSubmit={handleSubmit}
          errors={fieldErrors}
          formError={formError}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

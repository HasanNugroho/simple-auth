import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface SignUpFormProps {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  className?: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  formError?: string;
  isLoading?: boolean;
}

export function SignUpForm({
  onSubmit,
  className,
  errors,
  formError,
  isLoading = false,
}: SignUpFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Fill the form to register</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              {/* Error Global */}
              {formError && (
                <p className="text-sm text-red-500 text-center">{formError}</p>
              )}

              {/* Nama */}
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John"
                  required
                />
                {errors?.name && (
                  <p className="text-sm text-red-500">{errors.name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                {errors?.email && (
                  <p className="text-sm text-red-500">{errors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
                {errors?.password && (
                  <p className="text-sm text-red-500">{errors.password[0]}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign Up
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

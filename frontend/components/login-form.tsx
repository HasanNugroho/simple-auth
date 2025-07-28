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
import { Loader2 } from "lucide-react";
interface SignInFormProps {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  className?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
  formError?: string;
  isLoading: boolean;
}

export function LoginForm({
  onSubmit,
  className,
  errors,
  formError,
  isLoading = false,
}: SignInFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              {formError && (
                <p className="text-sm text-red-500 text-center">{formError}</p>
              )}

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  required
                />
                {errors?.email && (
                  <p className="text-sm text-red-500">{errors.email[0]}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
                {errors?.password && (
                  <p className="text-sm text-red-500">{errors.password[0]}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

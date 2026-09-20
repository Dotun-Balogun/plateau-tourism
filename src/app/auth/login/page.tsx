import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

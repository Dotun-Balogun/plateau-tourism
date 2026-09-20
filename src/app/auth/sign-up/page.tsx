import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}

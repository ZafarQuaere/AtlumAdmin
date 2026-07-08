import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@company.com"
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-emerald-600 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

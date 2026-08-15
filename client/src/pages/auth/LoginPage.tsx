import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AuthLayout from "@/components/auth/AuthLayout";

const LoginPage = () => {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>

          <CardDescription>
            Login to your LeadFlow AI account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Login form will come here */}
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
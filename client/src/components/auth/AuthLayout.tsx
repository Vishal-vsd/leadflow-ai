import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/50">
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
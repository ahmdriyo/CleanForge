import { AuthLayout } from "@/features/auth/components/auth-layout";

export default function AuthLayoutRoute({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

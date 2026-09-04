import { LoginForm } from "@/features/auth/components/login-form";

export default function Page() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-white rounded-[28px] lg:rounded-none">
      <LoginForm />
    </div>
  );
}

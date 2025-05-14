
import AuthForm from "@/components/auth/AuthForm";

export default function Auth() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center mb-6">Organize.me</h1>
      <AuthForm />
    </div>
  );
}

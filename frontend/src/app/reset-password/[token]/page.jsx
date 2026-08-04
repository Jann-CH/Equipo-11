import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-md mx-auto">
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
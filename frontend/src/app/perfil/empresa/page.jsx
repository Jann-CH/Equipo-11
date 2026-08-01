import { MyCompanyForm } from "@/components/auth/MyCompanyForm";


export default function EditarCompanyPage() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <MyCompanyForm />
        </div>
      </main>
    </>
  );
}

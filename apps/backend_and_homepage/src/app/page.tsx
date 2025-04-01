import LoginPage from "./login/page";

export default async function Home() {
  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginPage />
      </div>
    </main>
  );
}

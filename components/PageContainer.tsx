export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {children}
      </div>
    </main>
  );
}
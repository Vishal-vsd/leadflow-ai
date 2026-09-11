export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back! Here’s what’s happening with your leads.
          </p>
        </div>

        {/* Welcome Card */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Welcome to LeadFlow AI 👋
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your leads, track your pipeline, and grow your business
            smarter with AI.
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

export default function PreferencesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Preferences</h1>
          <p className="text-sm text-gray-500">
            Summary and adjustments for your account settings
          </p>
        </div>

        {/* Summary */}
        <section className="rounded-xl bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Summary</h2>
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
              Coming Soon
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Account status</span>
              <span className="blur-sm">Active</span>
            </div>

            <div className="flex justify-between">
              <span>Last updated</span>
              <span className="blur-sm">-- / -- / ----</span>
            </div>

            <div className="flex justify-between">
              <span>Preference completeness</span>
              <span className="blur-sm">78%</span>
            </div>
          </div>
        </section>

        {/* Adjustments */}
        <section className="rounded-xl bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Adjustments</h2>
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
              Coming Soon
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Fake setting row */}
            {[
              "Appearance theme",
              "Notification frequency",
              "Work schedule sync",
              "Timezone auto-detect",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-lg border bg-gray-50 p-3"
              >
                <span className="text-sm text-gray-600">{item}</span>
                <div className="flex items-center gap-2">
                  <div className="relative h-5 w-10 rounded-full bg-gray-200">
                    <div className="absolute top-1 left-1 h-3 w-3 rounded-full bg-gray-400" />
                  </div>
                  <span className="text-xs text-gray-400">locked</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer hint */}
        <div className="text-center text-xs text-gray-400">
          This section is under development. Changes will be available soon.
        </div>
      </div>
    </div>
  );
}

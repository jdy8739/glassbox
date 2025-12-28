'use client';

export default function AnalysisResult() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="glass-panel p-6">
          <h1 className="text-3xl font-bold text-white">Analysis Results</h1>
          <p className="text-white/70">Efficient Frontier and Hedging Recommendations</p>
        </div>

        {/* Tabs */}
        <div className="glass-panel p-6">
          <div className="space-y-6">
            <div className="border-b border-white/20">
              <div className="flex gap-4">
                <button className="border-b-2 border-white pb-2 font-semibold text-white">
                  Efficient Frontier
                </button>
                <button className="pb-2 font-semibold text-white/50 hover:text-white">
                  Beta Hedging
                </button>
              </div>
            </div>

            {/* Placeholder for Charts */}
            <div className="rounded-lg bg-white/5 p-8 text-center">
              <p className="text-white/70">Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button className="glass-button px-8 py-3 text-lg font-semibold text-white">
            Save Portfolio
          </button>
        </div>
      </div>
    </main>
  );
}

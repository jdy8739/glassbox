export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <nav className="glass-panel mx-4 mt-4 flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold text-white">Glassbox</div>
        <div className="flex gap-4">
          <a href="/portfolio/new" className="glass-button text-white">
            Analyze
          </a>
        </div>
      </nav>

      <div className="flex h-screen flex-col items-center justify-center px-4">
        <div className="glass-panel max-w-2xl space-y-6 px-8 py-12 text-center">
          <h1 className="text-5xl font-bold text-white">Glassbox</h1>
          <p className="text-xl text-white/80">
            Transparent portfolio optimization and beta hedging with Glass UI design
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass-panel rounded-xl p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">Efficient Frontier</h3>
              <p className="text-sm text-white/70">Optimize your portfolio allocation</p>
            </div>
            <div className="glass-panel rounded-xl p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">Beta Hedging</h3>
              <p className="text-sm text-white/70">Manage market exposure with confidence</p>
            </div>
            <div className="glass-panel rounded-xl p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">Glass UI</h3>
              <p className="text-sm text-white/70">Modern, transparent design philosophy</p>
            </div>
          </div>

          <button className="glass-button mt-8 px-8 py-3 text-lg font-semibold text-white">
            <a href="/portfolio/new">Start Analysis</a>
          </button>
        </div>
      </div>
    </main>
  );
}

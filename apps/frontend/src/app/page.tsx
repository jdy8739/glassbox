export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-grass-50 to-sky-50">
      <nav className="nature-panel mx-4 mt-4 flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-grass-700">Glassbox</h1>
        <div className="flex gap-4">
          <a href="/portfolio/new" className="nature-button text-sm">
            Analyze
          </a>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-4 py-12">
        <div className="nature-panel max-w-3xl space-y-8 px-8 py-12 text-center">
          <div className="space-y-4">
            <h1 className="bg-gradient-to-r from-grass-600 to-grass-500 bg-clip-text text-6xl font-bold text-transparent">
              Glassbox
            </h1>
            <p className="text-xl text-rain-600">
              Transparent portfolio optimization and beta hedging on a rainy day
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="nature-card">
              <div className="mb-3 text-3xl">📊</div>
              <h3 className="mb-2 text-lg font-semibold text-grass-700">Efficient Frontier</h3>
              <p className="text-sm text-rain-600">Optimize your portfolio allocation with mathematical precision</p>
            </div>
            <div className="nature-card">
              <div className="mb-3 text-3xl">🛡️</div>
              <h3 className="mb-2 text-lg font-semibold text-grass-700">Beta Hedging</h3>
              <p className="text-sm text-rain-600">Manage market exposure and reduce risk</p>
            </div>
            <div className="nature-card">
              <div className="mb-3 text-3xl">🌿</div>
              <h3 className="mb-2 text-lg font-semibold text-grass-700">Nature Design</h3>
              <p className="text-sm text-rain-600">Peaceful, organic interface grounded in nature</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
            <a href="/portfolio/new" className="nature-button">
              Start Analysis
            </a>
            <a href="/portfolios" className="nature-button-secondary">
              View Portfolios
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

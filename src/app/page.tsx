import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl animated-border p-0.5">
              <div className="w-full h-full bg-brand-dark rounded-xl flex items-center justify-center">
                <span className="text-lg">🧮</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Supreme Cal</h1>
              <p className="text-xs text-gray-500">Social Calculator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10">
        <Calculator />
      </div>
    </main>
  );
}

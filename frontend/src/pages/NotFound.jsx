export default function NotFound() {
  return (
    <section className="min-h-dvh bg-black text-white relative overflow-hidden">

      {/* Grid background */}
      <div className="absolute inset-0 
        bg-[linear-gradient(rgba(16,185,129,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.06)_1px,transparent_1px)]
        bg-size-[64px_64px]"
      />

      {/* Green radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,.22),transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">

          <h1 className="text-8xl md:text-[10rem] tracking-wide text-white">
            404
          </h1>

          <h2 className="mt-4 text-5xl md:text-7xl leading-tight">
            <span className="text-emerald-400">
              PAGE NOT FOUND
            </span>
          </h2>

          <p className="mt-8 text-gray-400 text-lg max-w-2xl mx-auto">
            The resource you requested does not exist,
            may have expired, or requires authentication.
          </p>
        </div>
      </div>
    </section>
  );
}
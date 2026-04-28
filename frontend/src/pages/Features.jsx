const Features = () => {
  return (
    <div className="min-h-dvh overflow-hidden bg-[#0b0f0d] text-white flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-3xl sm:text-4xl font-semibold text-emerald-400 mb-4">
          Features
        </h1>
        <p className="text-gray-300 text-base sm:text-lg">
          Secure authentication with JWT, protected routes, and persistent sessions.
        </p>
      </div>
    </div>
  );
};

export default Features;
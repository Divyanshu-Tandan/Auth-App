import {
  ShieldCheck,
  Users,
  LayoutDashboard,
  Settings,
  Moon,
  LockKeyhole
} from "lucide-react";

const featuresData = [
  {
    title: "Secure Authentication",
    description: "Robust login and registration flows secured with JSON Web Tokens (JWT) and HTTP-only cookies for enhanced safety.",
    icon: ShieldCheck
  },
  {
    title: "Role-Based Access",
    description: "Granular access control distinguishing between standard users and administrators, ensuring appropriate data visibility.",
    icon: Users
  },
  {
    title: "Admin Dashboard",
    description: "Comprehensive management panel allowing administrators to view, monitor, and delete user accounts securely.",
    icon: LayoutDashboard
  },
  {
    title: "Profile Management",
    description: "Intuitive interfaces for users to view and manage their profile details, with secure password reset capabilities.",
    icon: Settings
  },
  {
    title: "Modern UI/UX",
    description: "Sleek, responsive design featuring a dark mode aesthetic with elegant glassmorphism and subtle micro-animations.",
    icon: Moon
  },
  {
    title: "Session Security",
    description: "Advanced session handling with persistent states, automatic token refresh capabilities, and secure logout mechanisms.",
    icon: LockKeyhole
  }
];

const Features = () => {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0b0f0d] text-white pt-24 pb-16">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-emerald-400 mb-6">
            Platform Features
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Discover the powerful capabilities built into our secure authentication and user management system.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {featuresData.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/5 border border-emerald-400/20 rounded-3xl p-6 hover:bg-white/10 hover:border-emerald-400/40 transition-all duration-300 group shadow-[0_0_40px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.1)]"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                  <Icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Features;
import { 
  Database, 
  Server, 
  Layers, 
  Globe, 
  Palette, 
  LockKeyhole 
} from "lucide-react";

const stackData = [
  {
    title: "MongoDB",
    description: "NoSQL database used for flexible, scalable data storage of user profiles and authentication records.",
    icon: Database
  },
  {
    title: "Express.js",
    description: "Fast, unopinionated web framework for Node.js powering the backend API routes and middleware.",
    icon: Server
  },
  {
    title: "React",
    description: "Component-based frontend library for building a dynamic, reactive, and interactive user interface.",
    icon: Layers
  },
  {
    title: "Node.js",
    description: "Asynchronous event-driven JavaScript runtime executing the backend server and handling concurrent requests.",
    icon: Globe
  },
  {
    title: "Tailwind CSS",
    description: "Utility-first CSS framework enabling rapid UI development with a custom, premium design system.",
    icon: Palette
  },
  {
    title: "JSON Web Tokens",
    description: "Secure, stateless authentication mechanism utilizing HTTP-only cookies to protect user sessions.",
    icon: LockKeyhole
  }
];

const TechStack = () => {
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
            Technology Stack
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Built on a modern and robust architecture ensuring performance, scalability, and security.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stackData.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div 
                key={index}
                className="backdrop-blur-xl bg-white/5 border border-emerald-400/20 rounded-3xl p-8 hover:bg-white/10 hover:border-emerald-400/40 transition-all duration-300 group shadow-[0_0_40px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.1)]"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                  <Icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {tech.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  {tech.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default TechStack;

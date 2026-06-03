import { Shield, Sparkles, Code2, Code, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const About = () => {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0b0f0d] text-white pt-24 pb-16">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30" />
      
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-emerald-400 mb-6">
            About the Project
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            This application was built as a comprehensive portfolio project to demonstrate proficiency in full-stack development, focusing on secure authentication, role-based access control, and modern UI/UX design principles.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="backdrop-blur-xl bg-white/5 border border-emerald-400/20 rounded-3xl p-8 hover:bg-white/10 hover:border-emerald-400/40 transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.1)]">
            <Shield className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">Security First</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Implementing industry-standard security practices including JWT-based authentication, password hashing with bcrypt, and secure HTTP-only cookies.
            </p>
          </div>
          
          <div className="backdrop-blur-xl bg-white/5 border border-emerald-400/20 rounded-3xl p-8 hover:bg-white/10 hover:border-emerald-400/40 transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">Modern Design</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Utilizing Tailwind CSS to create a premium dark mode aesthetic with elegant glassmorphism, responsive layouts, and subtle micro-animations.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-emerald-400/20 rounded-3xl p-8 hover:bg-white/10 hover:border-emerald-400/40 transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.1)]">
            <Code2 className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">Clean Architecture</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Built with the MERN stack following RESTful API principles, maintaining clean, modular, and maintainable code structure across both frontend and backend.
            </p>
          </div>
        </div>

        {/* Developer Info / Connect Section */}
        <div className="backdrop-blur-xl bg-emerald-500/5 border border-emerald-400/30 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto flex flex-col items-center shadow-[0_0_80px_rgba(16,185,129,0.1)] animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            Connect with the Developer
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl text-base sm:text-lg">
            Hi, I'm Divyanshu Tandan. I'm passionate about building scalable web applications and crafting beautiful user experiences. Feel free to check out the source code or reach out to me!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <NavLink 
              to="https://github.com/Divyanshu-Tandan/Auth-App" 
              target="_blank"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition text-sm font-medium w-full sm:w-auto"
            >
              <Code className="w-5 h-5" />
              GitHub Repository
            </NavLink>
            <NavLink 
              to="https://www.linkedin.com/in/divyanshu-tandan-675a62261/" 
              target="_blank"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-400/40 hover:bg-emerald-500/30 text-emerald-300 transition text-sm font-medium w-full sm:w-auto"
            >
              <UserCircle className="w-5 h-5" />
              LinkedIn Profile
            </NavLink>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
import { Shield, CheckCircle2, Lock, Eye, Award } from 'lucide-react';

const TrustSection = () => {
  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-4 text-center md:px-6 md:py-10">
      <div className="relative overflow-hidden rounded-3xl bg-[#4C1D95] p-12 md:p-16">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="relative z-10">
          <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-md transition-transform duration-300 hover:scale-110">
            <Shield className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Your Data, Your Privacy
          </h3>
          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed font-medium text-white/90 md:text-xl">
            Built with privacy, security, and long-term consistency in mind. Your trust is our
            foundation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;

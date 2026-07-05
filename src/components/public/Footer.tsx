export default function Footer() {
  return (
    <footer className="bg-[#F8F9FA] border-t border-[#E9ECEF] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#E55A24] flex items-center justify-center">
              <span className="text-white font-black text-xs">1m</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#1A1A2E]">
              1min<span className="text-[#FF6B35]">product</span>
            </span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[#6C757D]">
            © {new Date().getFullYear()} 1minproduct. All rights reserved.
          </p>
        </div>

        {/* Affiliate disclosure */}
        <div className="mt-6 pt-6 border-t border-[#E9ECEF]">
          <p className="text-xs text-[#ADB5BD] text-center leading-relaxed max-w-2xl mx-auto">
            <strong className="text-[#6C757D]">Affiliate Disclosure:</strong> As an Amazon
            Associate, we may earn from qualifying purchases. Product prices and availability are
            accurate as of the date/time indicated and are subject to change.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-white py-16" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="wercor-logo text-2xl mb-2">Wercor</h3>
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#757F85' }}>By Zaapr</p>
            <p className="text-sm" style={{ color: '#757F85' }}>Find the right agency. Faster.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#E1E5E8' }}>Browse</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/agencies" className="hover:text-[#DCDE28] transition" style={{ color: '#757F85' }}>Agencies</Link></li>
              <li><Link href="/categories" className="hover:text-[#DCDE28] transition" style={{ color: '#757F85' }}>Categories</Link></li>
              <li><Link href="/locations" className="hover:text-[#DCDE28] transition" style={{ color: '#757F85' }}>Countries</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#E1E5E8' }}>Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/submit" className="hover:text-[#DCDE28] transition" style={{ color: '#757F85' }}>Submit Agency</Link></li>
              <li><Link href="/about" className="hover:text-[#DCDE28] transition" style={{ color: '#757F85' }}>About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: '#E1E5E8' }}>Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-[#DCDE28] transition" style={{ color: '#757F85' }}>Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#DCDE28] transition" style={{ color: '#757F85' }}>Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center" style={{ borderColor: '#212223' }}>
          <div className="text-sm" style={{ color: '#757F85' }}>© 2025 Wercor by Zaapr. All rights reserved.</div>
          <div className="text-xs mt-4 md:mt-0" style={{ color: '#757F85' }}>Agency Discovery Platform</div>
        </div>
      </div>
    </footer>
  );
}
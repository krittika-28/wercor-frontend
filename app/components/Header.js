'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/agencies', label: 'Agencies' },
    { href: '/categories', label: 'Categories' },
    { href: '/locations', label: 'Locations' },
  ];

  const isActive = (href) => pathname.startsWith(href);

  return (
    <header className="bg-white border-b sticky top-0 z-50" style={{ borderColor: '#E1E5E8' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col">
            <span className="wercor-logo text-3xl">Wercor</span>
            <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#757F85', marginTop: '-4px' }}>
              by Zaapr
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: isActive(link.href) ? '#0C493A' : '#212223',
                  fontWeight: isActive(link.href) ? 600 : 500
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/submit" className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              Submit Agency
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
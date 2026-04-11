'use client';
import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import Link from 'next/link';

export default function HomePage() {
  const [stats, setStats] = useState({ agencies: 0, categories: 0, countries: 0, continents: 0 });
  const [featuredAgencies, setFeaturedAgencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agenciesRes, categoriesRes, countriesRes, continentsRes] = await Promise.all([
          api.getAgencies({ featured: true, limit: 6 }),
          api.getCategories(),
          api.getCountries(),
          api.getContinents()
        ]);

        const agenciesData = agenciesRes.data.data || agenciesRes.data || [];
        const categoriesData = categoriesRes.data.data || categoriesRes.data || [];
        const countriesData = countriesRes.data.data || countriesRes.data || [];
        const continentsData = continentsRes.data.data || continentsRes.data || [];

        setFeaturedAgencies(agenciesData);
        setCategories(categoriesData.slice(0, 12));
        setCountries(countriesData.filter(c => parseInt(c.agency_count) > 0).slice(0, 12));
        setContinents(continentsData);

        setStats({
          agencies: agenciesData.length || 0,
          categories: categoriesData.length || 0,
          countries: countriesData.length || 0,
          continents: continentsData.length || 0
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/agencies?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EFFFFF' }}>
        <div className="text-center">
          <h1 className="wercor-logo text-4xl" style={{ color: '#0C493A' }}>Wercor</h1>
          <div className="animate-pulse mt-4" style={{ color: '#757F85' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
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
              <Link href="/agencies" className="text-sm font-medium hover:opacity-80" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                Agencies
              </Link>
              <Link href="/categories" className="text-sm font-medium hover:opacity-80" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                Categories
              </Link>
              <Link href="/locations" className="text-sm font-medium hover:opacity-80" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                Locations
              </Link>
              <Link href="/submit" className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                Submit Agency
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="text-white py-24 relative overflow-hidden" style={{ backgroundColor: '#0C493A' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C493A] via-[#0a3d31] to-[#083028] opacity-90" />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-5" style={{ backgroundColor: '#DCDE28' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] mb-6" style={{ fontFamily: 'var(--font-heading)', color: '#DCDE28' }}>
            Agency Discovery Platform
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
            Find The Right Agency.
            <br />
            <span style={{ color: '#DCDE28' }}>Faster.</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#CACFD2' }}>
            Discover verified agencies across {stats.countries}+ countries
            and {stats.continents} continents worldwide.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search agencies, categories, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="wercor-search flex-1 px-6 py-4 rounded-xl text-lg bg-white"
                style={{ color: '#212223' }}
              />
              <button type="submit" className="btn-accent px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
                Search
              </button>
            </div>
          </form>

          <div className="flex justify-center gap-12 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#DCDE28' }}>{stats.countries}+</div>
              <div className="text-sm mt-1" style={{ color: '#CACFD2' }}>Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#DCDE28' }}>{stats.categories}</div>
              <div className="text-sm mt-1" style={{ color: '#CACFD2' }}>Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: '#DCDE28' }}>{stats.agencies}+</div>
              <div className="text-sm mt-1" style={{ color: '#CACFD2' }}>Agencies</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINENTS */}
      <section className="py-12" style={{ backgroundColor: '#EFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
            Browse by Continent
          </h2>
          <div className="flex flex-wrap gap-3">
            {continents.map(continent => (
              <Link
                key={continent.continent}
                href={`/locations?continent=${encodeURIComponent(continent.continent)}`}
                className="wercor-pill bg-white hover:opacity-90"
              >
                <span className="font-medium" style={{ fontFamily: 'var(--font-heading)' }}>{continent.continent}</span>
                <span className="ml-2 text-xs opacity-70">
                  {continent.country_count} countries
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Browse by Category</h2>
              <p className="mt-2" style={{ color: '#757F85' }}>Find the perfect agency for your needs</p>
            </div>
            <Link href="/categories" className="text-sm font-semibold hover:underline" style={{ fontFamily: 'var(--font-heading)', color: '#0C493A' }}>
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map(category => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="wercor-card p-6">
                <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {category.name}
                </h3>
                <p className="text-sm line-clamp-2 mb-3" style={{ color: '#757F85' }}>{category.description}</p>
                <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)', color: '#0C493A' }}>
                  {category.agency_count || 0} agencies →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED AGENCIES */}
      <section className="py-20" style={{ backgroundColor: '#EFFFFF80' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Featured Agencies</h2>
              <p className="mt-2" style={{ color: '#757F85' }}>Top-rated agencies from around the world</p>
            </div>
            <Link href="/agencies" className="text-sm font-semibold hover:underline" style={{ fontFamily: 'var(--font-heading)', color: '#0C493A' }}>
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAgencies.map(agency => (
              <Link key={agency.id} href={`/agencies/${agency.slug}`} className="wercor-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>{agency.name}</h3>
                  {agency.is_featured && (
                    <span className="wercor-badge-featured text-xs px-2 py-1 rounded-full">⭐ Featured</span>
                  )}
                </div>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: '#757F85' }}>
                  {agency.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm" style={{ color: '#757F85' }}>
                    📍 {agency.city_name}, {agency.country_name}
                  </div>
                  {agency.is_verified && (
                    <span className="wercor-badge-verified text-xs px-2 py-1 rounded-full">✓ Verified</span>
                  )}
                </div>
                {agency.continent && (
                  <div className="mt-2 text-xs" style={{ color: '#CACFD2' }}>{agency.continent}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Browse by Country</h2>
              <p className="mt-2" style={{ color: '#757F85' }}>Agencies with the most listings</p>
            </div>
            <Link href="/locations" className="text-sm font-semibold hover:underline" style={{ fontFamily: 'var(--font-heading)', color: '#0C493A' }}>
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {countries.map(country => (
              <Link key={country.id} href={`/locations/${country.slug}`} className="wercor-card p-5 text-center">
                <div className="font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{country.name}</div>
                <div className="text-sm font-semibold" style={{ color: '#0C493A' }}>
                  {country.agency_count || 0} agencies
                </div>
                <div className="text-xs mt-1" style={{ color: '#CACFD2' }}>{country.continent}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: '#212223' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            List Your Agency
          </h2>
          <p className="text-lg mb-8" style={{ color: '#CACFD2' }}>
            Join {stats.agencies}+ agencies already listed on Wercor. Increase your visibility globally.
          </p>
          <Link href="/submit" className="btn-accent inline-block px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
            Submit Your Agency →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-white py-16" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="wercor-logo text-2xl mb-2">Wercor</h3>
              <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#757F85' }}>By Zaapr</p>
              <p className="text-sm" style={{ color: '#757F85' }}>
                Find the right agency. Faster. Across {stats.countries}+ countries worldwide.
              </p>
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
    </div>
  );
}
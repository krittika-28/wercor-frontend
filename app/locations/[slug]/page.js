'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/app/lib/api';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function CountryDetailPage() {
  const params = useParams();
  const [country, setCountry] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [countryRes, agenciesRes] = await Promise.all([
          api.getCountryBySlug(params.slug),
          api.getAgencies({ country: params.slug, city: selectedCity || undefined, limit: 50 })
        ]);
        setCountry(countryRes.data.data || countryRes.data);
        setAgencies(agenciesRes.data.data || agenciesRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    if (params.slug) loadData();
  }, [params.slug, selectedCity]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!country) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Country Not Found</h1>
            <Link href="/locations" className="wercor-link">← Back to all locations</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 text-sm" style={{ color: '#757F85' }}>
          <Link href="/" className="hover:underline" style={{ color: '#0C493A' }}>Home</Link>
          <span className="mx-2">›</span>
          <Link href="/locations" className="hover:underline" style={{ color: '#0C493A' }}>Locations</Link>
          <span className="mx-2">›</span>
          <span>{country.name}</span>
        </div>

        <h1 className="text-4xl font-bold mb-2">Agencies in {country.name}</h1>
        <p className="text-xl mb-6" style={{ color: '#757F85' }}>
          {country.continent} • {country.agency_count || 0} agencies across {country.cities?.length || 0} cities
        </p>

        {country.cities && country.cities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Filter by City</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setSelectedCity('')} className={`wercor-pill ${selectedCity === '' ? 'wercor-pill-active' : 'bg-white'}`}>
                All Cities
              </button>
              {country.cities.filter(c => parseInt(c.agency_count) > 0).map(city => (
                <button key={city.id} onClick={() => setSelectedCity(city.slug === selectedCity ? '' : city.slug)} className={`wercor-pill ${selectedCity === city.slug ? 'wercor-pill-active' : 'bg-white'}`}>
                  {city.name} ({city.agency_count || 0})
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map(agency => (
            <Link key={agency.id} href={`/agencies/${agency.slug}`} className="wercor-card p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>{agency.name}</h3>
                {agency.is_featured && <span className="wercor-badge-featured text-xs px-2 py-1 rounded-full">Featured</span>}
              </div>
              <p className="text-sm mb-4 line-clamp-2" style={{ color: '#757F85' }}>{agency.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm" style={{ color: '#757F85' }}>📍 {agency.city_name}</div>
                {agency.is_verified && <span className="wercor-badge-verified text-xs px-2 py-1 rounded-full">✓ Verified</span>}
              </div>
            </Link>
          ))}
        </div>

        {agencies.length === 0 && (
          <div className="text-center py-12 wercor-card">
            <p className="mb-4" style={{ color: '#757F85' }}>No agencies found.</p>
            <Link href="/submit" className="wercor-link">Be the first to add your agency →</Link>
          </div>
        )}

        <div className="mt-8">
          <Link href="/locations" className="wercor-link">← Back to all locations</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/app/lib/api';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

function LocationsPage() {
  const searchParams = useSearchParams();
  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContinent, setSelectedContinent] = useState(searchParams.get('continent') || '');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [countriesRes, continentsRes] = await Promise.all([
          api.getCountries({ continent: selectedContinent || undefined }),
          api.getContinents()
        ]);
        setCountries(countriesRes.data.data || countriesRes.data || []);
        setContinents(continentsRes.data.data || continentsRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, [selectedContinent]);

  const handleContinentChange = (continent) => {
    setSelectedContinent(continent === selectedContinent ? '' : continent);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EFFFFF' }}>
        <div style={{ fontFamily: 'var(--font-heading)', color: '#757F85' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">Browse by Location</h1>
        <p className="text-lg mb-8" style={{ color: '#757F85' }}>
          Find agencies across {countries.length} countries worldwide
        </p>

        <div className="mb-10">
          <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
            Filter by Continent
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleContinentChange('')}
              className={`wercor-pill ${selectedContinent === '' ? 'wercor-pill-active' : 'bg-white'}`}
            >
              All Continents
            </button>
            {continents.map(continent => (
              <button
                key={continent.continent}
                onClick={() => handleContinentChange(continent.continent)}
                className={`wercor-pill ${selectedContinent === continent.continent ? 'wercor-pill-active' : 'bg-white'}`}
              >
                {continent.continent} ({continent.country_count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {countries.map((country) => (
            <Link key={country.id} href={`/locations/${country.slug}`} className="wercor-card p-6 text-center">
              <h3 className="font-bold text-xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{country.name}</h3>
              <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)', color: '#0C493A' }}>
                {country.agency_count || 0} agencies
              </div>
              <div className="text-xs mt-2" style={{ color: '#CACFD2' }}>{country.continent}</div>
            </Link>
          ))}
        </div>

        {countries.length === 0 && (
          <div className="text-center py-16" style={{ color: '#757F85' }}>No countries found.</div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default LocationsPage;
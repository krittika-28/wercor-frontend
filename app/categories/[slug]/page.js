'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/app/lib/api';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiOverview, setAiOverview] = useState('');
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryRes, agenciesRes, countriesRes] = await Promise.all([
          api.getCategoryBySlug(params.slug),
          api.getAgencies({ category: params.slug, country: selectedCountry || undefined, limit: 50 }),
          api.getCountries()
        ]);
        setCategory(categoryRes.data.data || categoryRes.data);
        setAgencies(agenciesRes.data.data || agenciesRes.data || []);
        setCountries(countriesRes.data.data || countriesRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    if (params.slug) loadData();
  }, [params.slug, selectedCountry]);

  useEffect(() => {
    const loadAIOverview = async () => {
      try {
        setLoadingOverview(true);
        const url = selectedCountry
          ? `/categories/${params.slug}/overview?country=${selectedCountry}`
          : `/categories/${params.slug}/overview`;
        const response = await api.get(url);
        setAiOverview(response.data.data?.overview || response.data?.overview || '');
        setLoadingOverview(false);
      } catch {
        setLoadingOverview(false);
      }
    };
    if (params.slug) loadAIOverview();
  }, [params.slug, selectedCountry]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!category) return <div className="min-h-screen flex items-center justify-center">Category not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm" style={{ color: '#757F85' }}>
          <Link href="/" className="hover:underline" style={{ color: '#0C493A' }}>Home</Link>
          <span className="mx-2">›</span>
          <Link href="/categories" className="hover:underline" style={{ color: '#0C493A' }}>Categories</Link>
          <span className="mx-2">›</span>
          <span>{category.name}</span>
        </div>

        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        <p className="text-xl mb-6" style={{ color: '#757F85' }}>{category.description}</p>

        {/* Country Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
            Filter by Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 rounded-lg border min-w-[200px] focus:outline-none"
            style={{ borderColor: '#CACFD2' }}
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country.id} value={country.slug}>
                {country.name} ({country.agency_count || 0})
              </option>
            ))}
          </select>
        </div>

        AI Overview
        {loadingOverview ? (
          <div className="p-6 rounded-lg mb-8 border" style={{ backgroundColor: '#EFFFFF', borderColor: '#CACFD2' }}>
            <p style={{ color: '#757F85' }}>🤖 Generating AI overview...</p>
          </div>
        ) : aiOverview ? (
          <div className="p-6 rounded-lg mb-8 border" style={{ backgroundColor: '#EFFFFF', borderColor: '#CACFD2' }}>
            <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#0C493A' }}>🤖 AI Overview</h3>
            <p style={{ color: '#212223' }}>{aiOverview}</p>
          </div>
        ) : null}

        <p className="text-lg mb-8" style={{ color: '#757F85' }}>
          {agencies.length} agencies found
          {selectedCountry && ` in ${countries.find(c => c.slug === selectedCountry)?.name || selectedCountry}`}
        </p>

        {/* Agencies */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map(agency => (
            <Link key={agency.id} href={`/agencies/${agency.slug}`} className="wercor-card p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>{agency.name}</h3>
                {agency.is_verified && <span className="wercor-badge-verified text-xs px-2 py-1 rounded-full">✓</span>}
              </div>
              <p className="text-sm mb-4 line-clamp-2" style={{ color: '#757F85' }}>{agency.description}</p>
              <div className="text-sm" style={{ color: '#757F85' }}>📍 {agency.city_name}, {agency.country_name}</div>
              {agency.continent && <div className="text-xs mt-1" style={{ color: '#CACFD2' }}>{agency.continent}</div>}
            </Link>
          ))}
        </div>

        {agencies.length === 0 && (
          <div className="text-center py-12" style={{ color: '#757F85' }}>No agencies found.</div>
        )}

        <div className="mt-8">
          <Link href="/categories" className="wercor-link">← Back to all categories</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/app/lib/api';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

function AgenciesContent() {
  const searchParams = useSearchParams();
  const [agencies, setAgencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFeatured, setShowFeatured] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categoriesRes, countriesRes] = await Promise.all([
          api.getCategories(),
          api.getCountries()
        ]);
        setCategories(categoriesRes.data.data || categoriesRes.data || []);
        setCountries(countriesRes.data.data || countriesRes.data || []);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        setLoading(true);
        const params = {
          limit: 50,
        };

        if (selectedCategory) params.category = selectedCategory;
        if (selectedCountry) params.country = selectedCountry;
        if (searchQuery) params.search = searchQuery;
        if (showFeatured) params.featured = true;

        const response = await api.getAgencies(params);
        setAgencies(response.data.data || response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading agencies:', error);
        setLoading(false);
      }
    };
    loadAgencies();
  }, [selectedCategory, selectedCountry, searchQuery, showFeatured]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedCountry('');
    setSearchQuery('');
    setShowFeatured(false);
  };

  const hasFilters = selectedCategory || selectedCountry || searchQuery || showFeatured;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm" style={{ color: '#757F85' }}>
          <Link href="/" className="hover:underline" style={{ color: '#0C493A' }}>Home</Link>
          <span className="mx-2">›</span>
          <span>Agencies</span>
        </div>

        <h1 className="text-4xl font-bold mb-2">All Agencies</h1>
        <p className="text-lg mb-8" style={{ color: '#757F85' }}>
          Discover verified agencies worldwide
        </p>

        {/* Search & Filters */}
        <div className="wercor-card p-6 mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search agencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="wercor-search flex-1 px-4 py-3 rounded-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-3 rounded-lg border transition"
                  style={{ borderColor: '#CACFD2', color: '#757F85' }}
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-lg border focus:outline-none min-w-[200px]"
                style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.agency_count || 0})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2.5 rounded-lg border focus:outline-none min-w-[200px]"
                style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country.id} value={country.slug}>
                    {country.name} ({country.agency_count || 0})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition"
                style={{
                  borderColor: showFeatured ? '#0C493A' : '#CACFD2',
                  backgroundColor: showFeatured ? '#EFFFFF' : '#FFFFFF'
                }}
              >
                <input
                  type="checkbox"
                  checked={showFeatured}
                  onChange={(e) => setShowFeatured(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: '#0C493A' }}
                />
                <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                  Featured Only
                </span>
              </label>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 rounded-lg text-sm font-medium transition"
                style={{ color: '#0C493A', fontFamily: 'var(--font-heading)' }}
              >
                ✕ Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p style={{ color: '#757F85' }}>
            {loading ? 'Loading...' : `${agencies.length} agencies found`}
          </p>
        </div>

        {/* Agencies Grid */}
        {loading ? (
          <div className="text-center py-20" style={{ color: '#757F85' }}>Loading agencies...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map(agency => (
              <Link key={agency.id} href={`/agencies/${agency.slug}`} className="wercor-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
                    {agency.name}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0 ml-2">
                    {agency.is_featured && (
                      <span className="wercor-badge-featured text-xs px-2 py-1 rounded-full whitespace-nowrap">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm mb-4 line-clamp-2" style={{ color: '#757F85' }}>
                  {agency.description}
                </p>

                {/* Categories */}
                {agency.categories && (
                  <div className="mb-3 text-xs line-clamp-1" style={{ color: '#0C493A' }}>
                    {agency.categories}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm" style={{ color: '#757F85' }}>
                    📍 {agency.city_name}, {agency.country_name}
                  </div>
                  {agency.is_verified && (
                    <span className="wercor-badge-verified text-xs px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {agency.continent && (
                  <div className="mt-2 text-xs" style={{ color: '#CACFD2' }}>
                    {agency.continent}
                  </div>
                )}

                {/* Agency Meta */}
                <div className="flex gap-3 mt-3 pt-3 border-t" style={{ borderColor: '#E1E5E8' }}>
                  {agency.team_size && (
                    <div className="text-xs" style={{ color: '#757F85' }}>
                      👥 {agency.team_size}
                    </div>
                  )}
                  {agency.hourly_rate && (
                    <div className="text-xs" style={{ color: '#757F85' }}>
                      💰 {agency.hourly_rate}
                    </div>
                  )}
                  {agency.founded_year && (
                    <div className="text-xs" style={{ color: '#757F85' }}>
                      📅 {agency.founded_year}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && agencies.length === 0 && (
          <div className="text-center py-20 wercor-card">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              No agencies found
            </h3>
            <p className="mb-6" style={{ color: '#757F85' }}>
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="btn-outline px-6 py-3 rounded-lg font-semibold text-sm"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function AgenciesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AgenciesContent />
    </Suspense>
  );
}
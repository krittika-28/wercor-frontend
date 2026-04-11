'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/app/lib/api';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function AgencyDetailPage() {
  const params = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAgency = async () => {
      try {
        setLoading(true);
        const response = await api.getAgencyBySlug(params.slug);
        setAgency(response.data.data || response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading agency:', err);
        setError('Agency not found');
        setLoading(false);
      }
    };
    if (params.slug) loadAgency();
  }, [params.slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading agency...</div>;

  if (error || !agency) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Agency Not Found</h1>
            <Link href="/agencies" className="wercor-link">← Back to all agencies</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm" style={{ color: '#757F85' }}>
          <Link href="/" className="hover:underline" style={{ color: '#0C493A' }}>Home</Link>
          <span className="mx-2">›</span>
          <Link href="/agencies" className="hover:underline" style={{ color: '#0C493A' }}>Agencies</Link>
          <span className="mx-2">›</span>
          {agency.country_slug && (
            <>
              <Link href={`/locations/${agency.country_slug}`} className="hover:underline" style={{ color: '#0C493A' }}>
                {agency.country_name}
              </Link>
              <span className="mx-2">›</span>
            </>
          )}
          <span>{agency.name}</span>
        </div>

        <div className="wercor-card p-8 mb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{agency.name}</h1>
                {agency.is_featured && (
                  <span className="wercor-badge-featured text-sm px-3 py-1 rounded-full">⭐ Featured</span>
                )}
              </div>
              <div className="flex items-center gap-4" style={{ color: '#757F85' }}>
                <span>📍 {agency.city_name}, {agency.country_name}</span>
                {agency.continent && <span style={{ color: '#CACFD2' }}>• {agency.continent}</span>}
                {agency.is_verified && (
                  <span className="wercor-badge-verified text-sm px-2 py-1 rounded-full">✓ Verified</span>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Services</h3>
            <div className="flex flex-wrap gap-2">
              {agency.categories && agency.categories.map(category => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="wercor-tag hover:opacity-80"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>About</h3>
            <p className="leading-relaxed" style={{ color: '#212223' }}>{agency.description}</p>
          </div>

          {/* Agency Details */}
          {(agency.founded_year || agency.team_size || agency.hourly_rate || agency.min_project_size) && (
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {agency.founded_year && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#EFFFFF' }}>
                  <div className="text-sm" style={{ color: '#757F85' }}>Founded</div>
                  <div className="font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{agency.founded_year}</div>
                </div>
              )}
              {agency.team_size && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#EFFFFF' }}>
                  <div className="text-sm" style={{ color: '#757F85' }}>Team Size</div>
                  <div className="font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{agency.team_size}</div>
                </div>
              )}
              {agency.hourly_rate && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#EFFFFF' }}>
                  <div className="text-sm" style={{ color: '#757F85' }}>Hourly Rate</div>
                  <div className="font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{agency.hourly_rate}</div>
                </div>
              )}
              {agency.min_project_size && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#EFFFFF' }}>
                  <div className="text-sm" style={{ color: '#757F85' }}>Min. Project</div>
                  <div className="font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{agency.min_project_size}</div>
                </div>
              )}
            </div>
          )}

          {/* Contact */}
          <div className="border-t pt-6" style={{ borderColor: '#E1E5E8' }}>
            <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agency.website && (
                <div>
                  <div className="text-sm mb-1" style={{ color: '#757F85' }}>Website</div>
                  <a href={agency.website} target="_blank" rel="noopener noreferrer" className="wercor-link">
                    {agency.website}
                  </a>
                </div>
              )}
              {agency.email && (
                <div>
                  <div className="text-sm mb-1" style={{ color: '#757F85' }}>Email</div>
                  <a href={`mailto:${agency.email}`} className="wercor-link">{agency.email}</a>
                </div>
              )}
              {agency.phone && (
                <div>
                  <div className="text-sm mb-1" style={{ color: '#757F85' }}>Phone</div>
                  <a href={`tel:${agency.phone}`} className="wercor-link">{agency.phone}</a>
                </div>
              )}
              {agency.address && (
                <div>
                  <div className="text-sm mb-1" style={{ color: '#757F85' }}>Address</div>
                  <div style={{ color: '#212223' }}>{agency.address}</div>
                </div>
              )}
            </div>
          </div>

          {/* Location Link */}
          {agency.country_slug && (
            <div className="border-t mt-6 pt-6" style={{ borderColor: '#E1E5E8' }}>
              <Link href={`/locations/${agency.country_slug}`} className="wercor-link">
                View all agencies in {agency.country_name} →
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="border-t mt-6 pt-6" style={{ borderColor: '#E1E5E8' }}>
            <div className="text-sm" style={{ color: '#757F85' }}>
              Views: {agency.view_count} • Added: {new Date(agency.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <Link href="/agencies" className="wercor-link">← Back to all agencies</Link>
      </div>

      <Footer />
    </div>
  );
}
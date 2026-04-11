'use client';
import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.getCategories();
        setCategories(response.data.data || response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading categories:', error);
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2">All Categories</h1>
        <p className="text-lg mb-8" style={{ color: '#757F85' }}>
          Browse agencies by service type
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="wercor-card p-6">
              <h3 className="font-bold text-xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{category.name}</h3>
              <p className="mb-4 text-sm" style={{ color: '#757F85' }}>{category.description}</p>
              <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-heading)', color: '#0C493A' }}>
                {category.agency_count || 0} agencies →
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
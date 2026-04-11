'use client';
import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function SubmitAgencyPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    country_id: '',
    city_id: '',
    founded_year: '',
    team_size: '',
    min_project_size: '',
    hourly_rate: '',
    categories: []
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [countriesRes, categoriesRes] = await Promise.all([
          api.getCountries(),
          api.getCategories()
        ]);
        setCountries(countriesRes.data.data || countriesRes.data || []);
        setCategories(categoriesRes.data.data || categoriesRes.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (!formData.country_id) {
        setCities([]);
        return;
      }

      try {
        const selectedCountry = countries.find(c => c.id === parseInt(formData.country_id));
        if (selectedCountry) {
          const response = await api.getCities({ country: selectedCountry.slug });
          setCities(response.data.data || response.data || []);
        }
      } catch (err) {
        console.error('Error loading cities:', err);
      }
    };

    loadCities();
  }, [formData.country_id, countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'country_id') {
      setFormData(prev => ({
        ...prev,
        city_id: ''
      }));
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.categories.length === 0) {
      setError('Please select at least one category.');
      setLoading(false);
      return;
    }

    try {
      const slug = generateSlug(formData.name);
      await api.createAgency({
        ...formData,
        slug,
        country_id: parseInt(formData.country_id),
        city_id: parseInt(formData.city_id),
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null
      });

      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        website: '',
        email: '',
        phone: '',
        address: '',
        country_id: '',
        city_id: '',
        founded_year: '',
        team_size: '',
        min_project_size: '',
        hourly_rate: '',
        categories: []
      });
    } catch (err) {
      console.error('Error submitting agency:', err);
      setError(err.response?.data?.error || 'Failed to submit agency. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="wercor-card p-10 text-center max-w-md">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Agency Submitted!
            </h2>
            <p className="mb-6" style={{ color: '#757F85' }}>
              Thank you for submitting your agency. We will review it and add it to our directory soon.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSuccess(false)}
                className="btn-outline px-6 py-3 rounded-lg font-semibold text-sm"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Submit Another
              </button>
              <Link
                href="/"
                className="btn-primary px-6 py-3 rounded-lg font-semibold text-sm inline-block"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm" style={{ color: '#757F85' }}>
          <Link href="/" className="hover:underline" style={{ color: '#0C493A' }}>Home</Link>
          <span className="mx-2">›</span>
          <span>Submit Agency</span>
        </div>

        <h1 className="text-4xl font-bold mb-4">Submit Your Agency</h1>
        <p className="mb-8" style={{ color: '#757F85' }}>
          List your agency in the world&apos;s trusted directory. Fill out the form below to get started.
        </p>

        {error && (
          <div className="px-4 py-3 rounded-lg mb-6 border" style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', color: '#DC2626' }}>
            {error}
          </div>
        )}

        <div className="wercor-card p-8">
          <form onSubmit={handleSubmit}>

            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ fontFamily: 'var(--font-heading)', borderColor: '#E1E5E8' }}>
                Basic Information
              </h2>

              <div className="mb-6">
                <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                  Agency Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                  style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                  onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                  onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                  placeholder="e.g., Digital Minds Agency"
                />
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                  style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                  onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                  onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                  placeholder="Describe your agency, services, and what makes you unique..."
                />
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                  style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                  onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                  onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ fontFamily: 'var(--font-heading)', borderColor: '#E1E5E8' }}>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                    style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                    onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                    onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                    placeholder="contact@agency.com"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                    style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                    onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                    onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ fontFamily: 'var(--font-heading)', borderColor: '#E1E5E8' }}>
                Location
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                    Country *
                  </label>
                  <select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                    style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                    onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                    onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.name} ({country.continent})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                    City *
                  </label>
                  <select
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleChange}
                    required
                    disabled={!formData.country_id}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none disabled:opacity-50"
                    style={{
                      borderColor: '#CACFD2',
                      fontFamily: 'var(--font-body)',
                      backgroundColor: !formData.country_id ? '#E1E5E8' : '#FFFFFF'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                    onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                  >
                    <option value="">
                      {formData.country_id ? 'Select City' : 'Select Country First'}
                    </option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                  Full Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                  style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                  onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                  onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                  placeholder="Street address, building, suite..."
                />
              </div>
            </div>

            {/* Company Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ fontFamily: 'var(--font-heading)', borderColor: '#E1E5E8' }}>
                Company Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                    Founded Year
                  </label>
                  <input
                    type="number"
                    name="founded_year"
                    value={formData.founded_year}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                    style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                    onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                    onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                    placeholder="e.g., 2015"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                    Team Size
                  </label>
                  <select
                    name="team_size"
                    value={formData.team_size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                    style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                    onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                    onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                  >
                    <option value="">Select Team Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="10-25">10-25 employees</option>
                    <option value="25-50">25-50 employees</option>
                    <option value="50-100">50-100 employees</option>
                    <option value="100-200">100-200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                    Min. Project Size
                  </label>
                  <select
                    name="min_project_size"
                    value={formData.min_project_size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                    style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                    onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                    onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                  >
                    <option value="">Select Min. Project Size</option>
                    <option value="$1,000+">$1,000+</option>
                    <option value="$5,000+">$5,000+</option>
                    <option value="$10,000+">$10,000+</option>
                    <option value="$25,000+">$25,000+</option>
                    <option value="$50,000+">$50,000+</option>
                    <option value="$100,000+">$100,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                    Hourly Rate
                  </label>
                  <select
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                    style={{ borderColor: '#CACFD2', fontFamily: 'var(--font-body)' }}
                    onFocus={(e) => e.target.style.borderColor = '#0C493A'}
                    onBlur={(e) => e.target.style.borderColor = '#CACFD2'}
                  >
                    <option value="">Select Hourly Rate</option>
                    <option value="$25-50">$25-50</option>
                    <option value="$50-100">$50-100</option>
                    <option value="$100-150">$100-150</option>
                    <option value="$150-200">$150-200</option>
                    <option value="$200+">$200+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ fontFamily: 'var(--font-heading)', borderColor: '#E1E5E8' }}>
                Services / Categories *
              </h2>
              <p className="text-sm mb-4" style={{ color: '#757F85' }}>
                Select all services your agency offers
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map(category => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition"
                    style={{
                      borderColor: formData.categories.includes(category.id) ? '#0C493A' : '#E1E5E8',
                      backgroundColor: formData.categories.includes(category.id) ? '#EFFFFF' : '#FFFFFF'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-5 h-5"
                      style={{ accentColor: '#0C493A' }}
                    />
                    <span className="font-medium" style={{ fontFamily: 'var(--font-heading)', color: '#212223' }}>
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition"
              style={{
                fontFamily: 'var(--font-heading)',
                backgroundColor: loading ? '#CACFD2' : '#0C493A',
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Submitting...' : 'Submit Agency'}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  X, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Hero, SectionContainer } from '@/components/ui';
import { GALLERY_CATEGORIES, VISIBILITY_OPTIONS } from '@/lib/mock-gallery-categories';
import { mockClients } from '@/lib/mock-admin-data';

interface GalleryFormData {
  // Basic Information
  name: string;
  description: string;
  category: 'wedding' | 'portrait' | 'corporate' | 'nature' | 'street' | 'event' | 'other';
  
  // Visibility & Access
  visibility: 'public' | 'private' | 'client-review' | 'draft' | 'portfolio';
  clientId?: number;
  password?: string;
  
  // SEO & Metadata
  seoTitle?: string;
  seoDescription?: string;
  urlSlug?: string;
  
  // Options
  tags: string[];
  enableWatermark: boolean;
  allowDownloads: boolean;
  expirationDate?: string;
  
  // Cover Photo
  coverPhotoId?: number;
  coverPhotoUrl?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function NewGalleryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSeoSection, setShowSeoSection] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const [formData, setFormData] = useState<GalleryFormData>({
    name: '',
    description: '',
    category: 'wedding',
    visibility: 'draft',
    tags: [],
    enableWatermark: false,
    allowDownloads: true,
    urlSlug: '',
  });

  // Auto-generate URL slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle input changes
  const handleInputChange = (field: keyof GalleryFormData, value: string | boolean | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when name changes
      if (field === 'name' && typeof value === 'string') {
        updated.urlSlug = generateSlug(value);
      }
      
      return updated;
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Add tag
  const handleAddTag = () => {
    if (currentTag.trim() && formData.tags.length < 20) {
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required fields
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Gallery name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Gallery name must be less than 100 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Visibility-specific validation
    if (formData.visibility === 'client-review' && !formData.clientId) {
      newErrors.clientId = 'Please select a client for client review galleries';
    }

    if (formData.visibility === 'private' && !formData.password) {
      newErrors.password = 'Password is required for private galleries';
    }

    // Description max length
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // URL slug validation
    if (formData.urlSlug && !/^[a-z0-9-]+$/.test(formData.urlSlug)) {
      newErrors.urlSlug = 'URL slug can only contain lowercase letters, numbers, and hyphens';
    }

    // Expiration date validation
    if (formData.expirationDate) {
      const expirationDate = new Date(formData.expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expirationDate < today) {
        newErrors.expirationDate = 'Expiration date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent, isDraft = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      console.log('Creating gallery:', { ...formData, status: isDraft ? 'draft' : 'published' });
      
      // Redirect to admin page on success
      router.push('/admin');
    } catch (error) {
      console.error('Error creating gallery:', error);
      setErrors({ submit: 'Failed to create gallery. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-gradient">
      <Hero
        title="Create New Gallery"
        description="Set up a new photo gallery with custom settings and privacy options"
      />

      <SectionContainer>
        <form onSubmit={(e) => handleSubmit(e, false)} className="max-w-4xl mx-auto">
          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="card-base p-4 mb-6 border-l-4 border-red-500" role="alert">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    Please fix the following errors:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="card-base p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Basic Information
            </h3>
            
            <div className="space-y-4">
              {/* Gallery Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Gallery Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter gallery name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  id="description"
                  className="form-input"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your gallery"
                  maxLength={500}
                  aria-describedby="description-counter"
                />
                <p id="description-counter" className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-right">
                  {formData.description.length} / 500
                </p>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  aria-required="true"
                  aria-invalid={!!errors.category}
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Visibility & Access */}
          <div className="card-base p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Visibility &amp; Access
            </h3>

            <div className="space-y-4">
              {/* Visibility Options */}
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">
                  Visibility Type <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {VISIBILITY_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.visibility === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={formData.visibility === option.value}
                          onChange={(e) => handleInputChange('visibility', e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            <span className="font-medium text-slate-900 dark:text-white">
                              {option.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Conditional: Client Selection */}
              {formData.visibility === 'client-review' && (
                <div>
                  <label htmlFor="clientId" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Select Client <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="clientId"
                    className="form-select"
                    value={formData.clientId || ''}
                    onChange={(e) => handleInputChange('clientId', parseInt(e.target.value))}
                    aria-required="true"
                    aria-invalid={!!errors.clientId}
                  >
                    <option value="">-- Select a client --</option>
                    {mockClients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  {errors.clientId && (
                    <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>
                  )}
                </div>
              )}

              {/* Conditional: Password */}
              {formData.visibility === 'private' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-input"
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                    aria-required="true"
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              )}

              {/* Expiration Date */}
              <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  id="expirationDate"
                  className="form-input"
                  value={formData.expirationDate || ''}
                  onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  aria-invalid={!!errors.expirationDate}
                />
                {errors.expirationDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* SEO & Organization (Collapsible) */}
          <div className="card-base p-6 mb-6">
            <button
              type="button"
              onClick={() => setShowSeoSection(!showSeoSection)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                SEO &amp; Organization
              </h3>
              {showSeoSection ? (
                <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              )}
            </button>

            {showSeoSection && (
              <div className="space-y-4 mt-4">
                {/* URL Slug */}
                <div>
                  <label htmlFor="urlSlug" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    id="urlSlug"
                    className="form-input"
                    value={formData.urlSlug}
                    onChange={(e) => handleInputChange('urlSlug', e.target.value)}
                    placeholder="auto-generated-slug"
                    aria-invalid={!!errors.urlSlug}
                  />
                  {errors.urlSlug && (
                    <p className="text-red-500 text-sm mt-1">{errors.urlSlug}</p>
                  )}
                </div>

                {/* SEO Title */}
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    className="form-input"
                    value={formData.seoTitle || ''}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    placeholder="Custom SEO title"
                  />
                </div>

                {/* SEO Description */}
                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    SEO Meta Description
                  </label>
                  <textarea
                    id="seoDescription"
                    className="form-input"
                    rows={3}
                    value={formData.seoDescription || ''}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    placeholder="SEO meta description"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Tags (Max 20)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id="tags"
                      className="form-input flex-1"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add a tag"
                      disabled={formData.tags.length >= 20}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn-secondary px-4"
                      disabled={formData.tags.length >= 20 || !currentTag.trim()}
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-blue-600 dark:hover:text-blue-300"
                            aria-label={`Remove tag ${tag}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Gallery Settings */}
          <div className="card-base p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Gallery Settings
            </h3>

            <div className="space-y-4">
              {/* Enable Watermark */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableWatermark}
                  onChange={(e) => handleInputChange('enableWatermark', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Enable Watermark
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Apply watermark to all photos in this gallery
                  </p>
                </div>
              </label>

              {/* Allow Downloads */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowDownloads}
                  onChange={(e) => handleInputChange('allowDownloads', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Allow Downloads
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Allow users to download photos from this gallery
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Link href="/admin" className="btn-secondary text-center">
              Cancel
            </Link>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Creating...'
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Create Gallery
                </>
              )}
            </button>
          </div>
        </form>
      </SectionContainer>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Button, useToast } from '@/components/ui';
import { 
  Plus, 
  Search,
  FileText,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share,
  Filter
} from 'lucide-react';
import Link from 'next/link';

interface CV {
  id: string;
  name: string;
  description?: string;
  template: string;
  isPublic: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CVsPage() {
  const { user, isLoading } = useRequireAuth();
  const { success, error } = useToast();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [filteredCvs, setFilteredCvs] = useState<CV[]>([]);
  const [isLoadingCvs, setIsLoadingCvs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'created'>('updated');
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchCvs = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch('/api/cvs', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setCvs(data.cvs || []);
      } else {
        console.error('Failed to fetch CVs:', response.status, response.statusText);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timed out');
      } else {
        console.error('Error fetching CVs:', error);
      }
    } finally {
      setIsLoadingCvs(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCvs();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...cvs];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(cv => 
        cv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cv.description && cv.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply visibility filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(cv => 
        filterBy === 'public' ? cv.isPublic : !cv.isPublic
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    setFilteredCvs(filtered);
  }, [cvs, searchQuery, filterBy, sortBy]);

  const handleDeleteCv = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/cvs/${cvId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCvs(prev => prev.filter(cv => cv.id !== cvId));
        success('CV deleted successfully', 'Your CV has been permanently removed.');
      } else {
        error('Failed to delete CV', 'Please try again or contact support if the problem persists.');
      }
    } catch (err) {
      console.error('Error deleting CV:', err);
      error('An error occurred while deleting the CV', 'Please check your connection and try again.');
    }
  };

  const handleDuplicateCv = async (cvId: string) => {
    try {
      const response = await fetch(`/api/cvs/${cvId}/duplicate`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setCvs(prev => [data.cv, ...prev]);
        success('CV duplicated successfully', 'A copy of your CV has been created.');
      } else {
        error('Failed to duplicate CV', 'Please try again or contact support if the problem persists.');
      }
    } catch (err) {
      console.error('Error duplicating CV:', err);
      error('An error occurred while duplicating the CV', 'Please check your connection and try again.');
    }
  };

  const handleShareCv = async (cvId: string) => {
    try {
      const response = await fetch(`/api/cvs/${cvId}/share`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        const shareUrl = `${window.location.origin}/cv/shared/${data.shareToken}`;
        
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
          success('Share link copied!', 'The link has been copied to your clipboard.');
        } else {
          prompt('Copy this link to share your CV:', shareUrl);
        }
        
        // Update the CV in state
        setCvs(prev => prev.map(cv => 
          cv.id === cvId ? { ...cv, shareToken: data.shareToken, isPublic: true } : cv
        ));
      } else {
        error('Failed to create share link', 'Please try again or contact support if the problem persists.');
      }
    } catch (err) {
      console.error('Error sharing CV:', err);
      error('An error occurred while creating the share link', 'Please check your connection and try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My CVs</h1>
            <p className="text-sm text-gray-600 mt-1">
              Create, manage, and share your professional resumes
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/dashboard/cvs/builder">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New CV
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search CVs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="updated">Last Updated</option>
                    <option value="created">Date Created</option>
                    <option value="name">Name</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All CVs</option>
                    <option value="private">Private Only</option>
                    <option value="public">Shared Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CV Grid */}
        {isLoadingCvs ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCvs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchQuery || filterBy !== 'all' ? 'No CVs found' : 'No CVs yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || filterBy !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first CV'
              }
            </p>
            {!searchQuery && filterBy === 'all' && (
              <div className="mt-6">
                <Link href="/dashboard/cvs/builder">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First CV
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCvs.map((cv) => (
              <div key={cv.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {cv.name}
                      </h3>
                      {cv.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {cv.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      {cv.isPublic && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Shared
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="capitalize">{cv.template}</span>
                      <span className="mx-2">•</span>
                      <span>Updated {new Date(cv.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/cvs/builder?id=${cv.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      
                      {cv.shareToken ? (
                        <Link
                          href={`/cv/shared/${cv.shareToken}`}
                          target="_blank"
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleShareCv(cv.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDuplicateCv(cv.id)}
                        className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                        title="Duplicate CV"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCv(cv.id)}
                        className="p-2 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
                        title="Delete CV"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {filteredCvs.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{cvs.length}</div>
                <div className="text-sm text-gray-500">Total CVs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {cvs.filter(cv => cv.isPublic).length}
                </div>
                <div className="text-sm text-gray-500">Shared CVs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {cvs.filter(cv => !cv.isPublic).length}
                </div>
                <div className="text-sm text-gray-500">Private CVs</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
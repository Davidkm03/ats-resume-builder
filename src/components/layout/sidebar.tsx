"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home,
  FileText,
  LayoutTemplate,
  BarChart,
  Settings,
  CreditCard,
  User,
  Sparkles,
  X,
  Shield,
  Download
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Home
  },
  { 
    name: 'My CVs', 
    href: '/dashboard/cvs', 
    icon: FileText
  },
  { 
    name: 'Templates', 
    href: '/dashboard/templates', 
    icon: LayoutTemplate
  },
  { 
    name: 'CV Validator', 
    href: '/dashboard/cv-validator', 
    icon: Shield
  },
  { 
    name: 'LinkedIn Import', 
    href: '/dashboard/linkedin-import', 
    icon: Download
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: BarChart,
    premium: true
  },
  { 
    name: 'AI Assistant', 
    href: '/dashboard/ai', 
    icon: Sparkles,
    premium: true
  },
];

const secondaryNavigation = [
  { 
    name: 'Profile', 
    href: '/dashboard/profile', 
    icon: User
  },
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings
  },
  { 
    name: 'Subscription', 
    href: '/dashboard/subscription', 
    icon: CreditCard
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isPremium = session?.user?.subscriptionTier === 'premium';

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header - only visible on mobile */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Primary navigation */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const isDisabled = item.premium && !isPremium;

                return (
                  <Link
                    key={item.name}
                    href={isDisabled ? '#' : item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={(e) => {
                      if (isDisabled) {
                        e.preventDefault();
                      } else {
                        onClose();
                      }
                    }}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        active
                          ? 'text-blue-500'
                          : isDisabled
                          ? 'text-gray-400'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.premium && !isPremium && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pro
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />

            {/* Secondary navigation */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
              {secondaryNavigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={onClose}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        active
                          ? 'text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Upgrade prompt for free users */}
          {!isPremium && (
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <Sparkles className="h-6 w-6 mr-2" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Upgrade to Pro</h4>
                    <p className="text-xs opacity-90 mt-1">
                      Unlock AI features and premium templates
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/subscription"
                  className="mt-3 block w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-center py-2 px-4 rounded text-sm font-medium transition-colors"
                  onClick={onClose}
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
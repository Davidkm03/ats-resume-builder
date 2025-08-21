import { forwardRef } from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    children, 
    className = '', 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    
    const variantClasses = {
      primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
      secondary: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100',
      danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
      ghost: 'text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-blue-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
          isDisabled ? 'cursor-not-allowed opacity-50' : ''
        } ${className}`}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// LinkButton component for buttons that act as links
interface LinkButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  href: string;
  target?: string;
  external?: boolean;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    children, 
    className = '', 
    disabled,
    href,
    target,
    external = false,
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    
    const variantClasses = {
      primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
      secondary: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100',
      danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
      ghost: 'text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-blue-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    if (disabled) {
      return (
        <span className={`${classes} opacity-50 cursor-not-allowed`}>
          {children}
        </span>
      );
    }

    if (external || href.startsWith('http')) {
      return (
        <a
          ref={ref}
          href={href}
          target={target || '_blank'}
          rel="noopener noreferrer"
          className={classes}
        >
          {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />}
          {children}
        </a>
      );
    }

    return (
      <Link href={href}>
        <span
          ref={ref}
          className={classes}
        >
          {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />}
          {children}
        </span>
      </Link>
    );
  }
);

LinkButton.displayName = 'LinkButton';

export default Button;
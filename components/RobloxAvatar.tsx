
import React, { useState, useEffect } from 'react';
import { getRobloxAvatarUrl } from '../utils/robloxAvatar';

interface RobloxAvatarProps {
  username: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const RobloxAvatar: React.FC<RobloxAvatarProps> = ({ username, className = '', size = 'md' }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) {
      setAvatarUrl(null);
      setError(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(false);

    getRobloxAvatarUrl(username)
      .then((url) => {
        if (isMounted) {
          setAvatarUrl(url);
          if (!url) setError(true);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [username]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16 md:w-24 md:h-24',
    lg: 'w-28 h-28 md:w-40 md:h-40',
    xl: 'w-32 h-32 md:w-48 md:h-48',
  };

  const placeholder = (
    <div className={`bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center rounded-2xl ${sizeClasses[size]} ${className}`}>
      <svg className="w-1/2 h-1/2 text-zinc-300 dark:text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  if (!username) return placeholder;

  if (loading) {
    return (
      <div className={`bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl ${sizeClasses[size]} ${className}`} />
    );
  }

  if (error || !avatarUrl) return placeholder;

  return (
    <img
      src={avatarUrl}
      alt={username}
      className={`object-contain rounded-2xl ${sizeClasses[size]} ${className}`}
      loading="lazy"
      decoding="async"
      crossOrigin="anonymous"
      onError={() => setError(true)}
    />
  );
};

export default RobloxAvatar;

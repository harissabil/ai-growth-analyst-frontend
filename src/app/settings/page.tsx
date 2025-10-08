'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Settings from '@/components/Settings';

export default function SettingsPage() {
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
    }
  }, [router]);

  if (!isAuthenticated()) {
    return null;
  }

  return <Settings />;
}

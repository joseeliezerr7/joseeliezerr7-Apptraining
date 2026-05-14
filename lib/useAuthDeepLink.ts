import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { supabase } from './supabase';

function parseHash(url: string): URLSearchParams {
  const hashIdx = url.indexOf('#');
  if (hashIdx < 0) return new URLSearchParams();
  return new URLSearchParams(url.slice(hashIdx + 1));
}

async function handleUrl(url: string, router: ReturnType<typeof useRouter>) {
  const params = parseHash(url);
  const type = params.get('type');
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (accessToken && refreshToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  if (type === 'recovery') {
    router.replace('/(auth)/reset-password');
  } else if (type === 'signup') {
    router.replace('/(app)');
  }
}

export function useAuthDeepLink() {
  const router = useRouter();
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url, router);
    });
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url, router));
    return () => sub.remove();
  }, [router]);
}

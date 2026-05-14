// Supabase Edge Function: notify-new-video
//
// Trigger: invoke from a `videos` table INSERT webhook (Database → Webhooks).
// Body: { type: 'INSERT', record: { id, title_en, title_es, thumbnail_url, ... } }
//
// Sends an Expo push to every profile that has push_token.
// Deploy:
//   supabase functions deploy notify-new-video
//   supabase functions secrets set EXPO_ACCESS_TOKEN=...   # optional, raises rate limit
//
// Set up the webhook to POST here with the service_role key in Authorization.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

type Payload = {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: {
    id: string;
    title_en: string;
    title_es: string;
    thumbnail_url?: string | null;
    category_id?: string | null;
  } | null;
};

type ExpoMessage = {
  to: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  sound?: 'default';
};

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const payload = (await req.json()) as Payload;
  if (payload.type !== 'INSERT' || !payload.record) {
    return new Response('ignored', { status: 200 });
  }
  const v = payload.record;

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('push_token')
    .not('push_token', 'is', null);

  if (error) {
    console.error('profiles fetch error', error);
    return new Response(error.message, { status: 500 });
  }

  const tokens = (profiles ?? [])
    .map((p) => p.push_token as string | null)
    .filter((t): t is string => !!t);

  if (tokens.length === 0) return new Response('no tokens', { status: 200 });

  // Send 100 per batch (Expo limit)
  const batches: string[][] = [];
  for (let i = 0; i < tokens.length; i += 100) batches.push(tokens.slice(i, i + 100));

  const expoToken = Deno.env.get('EXPO_ACCESS_TOKEN');

  for (const batch of batches) {
    const messages: ExpoMessage[] = batch.map((to) => ({
      to,
      title: 'New training video',
      body: v.title_en,
      data: { video_id: v.id, type: 'new_video' },
      sound: 'default',
    }));

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    };
    if (expoToken) headers.Authorization = `Bearer ${expoToken}`;

    const r = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(messages),
    });
    if (!r.ok) {
      console.error('expo push failed', r.status, await r.text());
    }
  }

  return new Response(JSON.stringify({ sent: tokens.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

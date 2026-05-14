import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, SUPABASE_CONFIGURED } from './supabase';

const STORAGE_KEY = 'app.notes';

async function readLocal(): Promise<Record<string, { content: string; updated_at: string }>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function writeLocal(map: Record<string, { content: string; updated_at: string }>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export async function getNotes(userId: string, videoId: string): Promise<string> {
  if (!SUPABASE_CONFIGURED) {
    const map = await readLocal();
    return map[videoId]?.content ?? '';
  }
  const { data, error } = await supabase
    .from('video_notes')
    .select('content')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .maybeSingle();
  if (error) throw error;
  return (data?.content as string) ?? '';
}

export async function saveNotes(
  userId: string,
  videoId: string,
  content: string
): Promise<void> {
  if (!SUPABASE_CONFIGURED) {
    const map = await readLocal();
    map[videoId] = { content, updated_at: new Date().toISOString() };
    await writeLocal(map);
    return;
  }
  const { error } = await supabase
    .from('video_notes')
    .upsert({ user_id: userId, video_id: videoId, content });
  if (error) throw error;
}

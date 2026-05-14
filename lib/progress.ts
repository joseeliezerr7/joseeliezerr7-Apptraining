import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, SUPABASE_CONFIGURED } from './supabase';

export type Progress = {
  video_id: string;
  position_seconds: number;
  duration_seconds: number;
  updated_at: string;
};

const STORAGE_KEY = 'app.progress';

async function readLocal(): Promise<Record<string, Progress>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Record<string, Progress>) : {};
}

async function writeLocal(map: Record<string, Progress>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export async function getProgress(
  userId: string,
  videoId: string
): Promise<Progress | null> {
  if (!SUPABASE_CONFIGURED) {
    const map = await readLocal();
    return map[videoId] ?? null;
  }
  const { data, error } = await supabase
    .from('video_progress')
    .select('video_id, position_seconds, duration_seconds, updated_at')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .maybeSingle();
  if (error) throw error;
  return (data as Progress) ?? null;
}

export async function saveProgress(
  userId: string,
  videoId: string,
  positionSeconds: number,
  durationSeconds: number
): Promise<void> {
  // Skip near-zero or fully-finished progress to keep "continue watching" clean
  if (positionSeconds < 5) return;
  if (durationSeconds > 0 && positionSeconds >= durationSeconds * 0.97) return;

  if (!SUPABASE_CONFIGURED) {
    const map = await readLocal();
    map[videoId] = {
      video_id: videoId,
      position_seconds: Math.floor(positionSeconds),
      duration_seconds: Math.floor(durationSeconds),
      updated_at: new Date().toISOString(),
    };
    await writeLocal(map);
    return;
  }
  const { error } = await supabase.from('video_progress').upsert({
    user_id: userId,
    video_id: videoId,
    position_seconds: Math.floor(positionSeconds),
    duration_seconds: Math.floor(durationSeconds),
  });
  if (error) throw error;
}

export async function listContinueWatching(
  userId: string,
  limit = 10
): Promise<Progress[]> {
  if (!SUPABASE_CONFIGURED) {
    const map = await readLocal();
    return Object.values(map)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, limit);
  }
  const { data, error } = await supabase
    .from('video_progress')
    .select('video_id, position_seconds, duration_seconds, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Progress[];
}

export function percentWatched(p: Progress): number {
  if (p.duration_seconds <= 0) return 0;
  return Math.min(100, Math.round((p.position_seconds / p.duration_seconds) * 100));
}

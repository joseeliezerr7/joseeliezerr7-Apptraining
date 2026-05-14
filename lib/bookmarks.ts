import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, SUPABASE_CONFIGURED } from './supabase';

export type BookmarkType = 'video' | 'manual';

const STORAGE_KEY = 'app.bookmarks';

type StoredBookmark = { type: BookmarkType; id: string; created_at: string };

async function readLocal(): Promise<StoredBookmark[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as StoredBookmark[]) : [];
}

async function writeLocal(list: StoredBookmark[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function listBookmarks(
  userId: string
): Promise<StoredBookmark[]> {
  if (!SUPABASE_CONFIGURED) return readLocal();
  const { data, error } = await supabase
    .from('bookmarks')
    .select('item_type, item_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    type: r.item_type as BookmarkType,
    id: r.item_id as string,
    created_at: r.created_at as string,
  }));
}

export async function isBookmarked(
  userId: string,
  type: BookmarkType,
  id: string
): Promise<boolean> {
  if (!SUPABASE_CONFIGURED) {
    const list = await readLocal();
    return list.some((b) => b.type === type && b.id === id);
  }
  const { data, error } = await supabase
    .from('bookmarks')
    .select('item_id')
    .eq('user_id', userId)
    .eq('item_type', type)
    .eq('item_id', id)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function addBookmark(
  userId: string,
  type: BookmarkType,
  id: string
): Promise<void> {
  if (!SUPABASE_CONFIGURED) {
    const list = await readLocal();
    if (list.some((b) => b.type === type && b.id === id)) return;
    await writeLocal([
      ...list,
      { type, id, created_at: new Date().toISOString() },
    ]);
    return;
  }
  const { error } = await supabase
    .from('bookmarks')
    .upsert({ user_id: userId, item_type: type, item_id: id });
  if (error) throw error;
}

export async function removeBookmark(
  userId: string,
  type: BookmarkType,
  id: string
): Promise<void> {
  if (!SUPABASE_CONFIGURED) {
    const list = await readLocal();
    await writeLocal(list.filter((b) => !(b.type === type && b.id === id)));
    return;
  }
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('item_type', type)
    .eq('item_id', id);
  if (error) throw error;
}

export async function toggleBookmark(
  userId: string,
  type: BookmarkType,
  id: string
): Promise<boolean> {
  const exists = await isBookmarked(userId, type, id);
  if (exists) {
    await removeBookmark(userId, type, id);
    return false;
  }
  await addBookmark(userId, type, id);
  return true;
}

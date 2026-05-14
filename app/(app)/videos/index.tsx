import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { CategoryChip } from '@/components/CategoryChip';
import { VideoCard } from '@/components/VideoCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { VideoCardSkeleton } from '@/components/Skeleton';
import { useToast } from '@/components/Toast';
import { fetchCategories, fetchVideos } from '@/lib/api';
import type { Video, VideoCategory } from '@/lib/supabase';
import { colors, spacing, typography } from '@/constants/theme';

export default function VideosIndex() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [c, v] = await Promise.all([fetchCategories(), fetchVideos()]);
      setCategories(c);
      setVideos(v);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to load videos');
    }
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const filtered = useMemo(() => {
    const lang = i18n.language as 'en' | 'es';
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      if (selected && v.category_id !== selected) return false;
      if (!q) return true;
      const title = (lang === 'es' ? v.title_es : v.title_en).toLowerCase();
      return title.includes(q);
    });
  }, [selected, videos, query, i18n.language]);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('videos.title')}</Text>
        <Text style={styles.subtitle}>{t('videos.subtitle')}</Text>
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChange={setQuery} />
        </View>
      </View>

      <FlatList
        data={[{ id: '__all', slug: '', name_en: '', name_es: '', thumbnail_url: null, order_index: 0 }, ...categories]}
        horizontal
        keyExtractor={(c) => c.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsList}
        renderItem={({ item }) =>
          item.id === '__all' ? (
            <CategoryChip
              label={t('videos.allCategories')}
              selected={selected === null}
              onPress={() => setSelected(null)}
            />
          ) : (
            <CategoryChip
              label={i18n.language === 'es' ? item.name_es : item.name_en}
              selected={selected === item.id}
              onPress={() => setSelected(item.id)}
            />
          )
        }
      />

      {loading ? (
        <View style={styles.grid}>
          <View style={styles.row}>
            <View style={styles.tile}><VideoCardSkeleton width={160} /></View>
            <View style={styles.tile}><VideoCardSkeleton width={160} /></View>
          </View>
          <View style={styles.row}>
            <View style={styles.tile}><VideoCardSkeleton width={160} /></View>
            <View style={styles.tile}><VideoCardSkeleton width={160} /></View>
          </View>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(v) => v.id}
          numColumns={2}
          columnWrapperStyle={{ gap: spacing.md }}
          contentContainerStyle={styles.grid}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />
          }
          renderItem={({ item }) => (
            <View style={styles.tile}>
              <VideoCard video={item} size="sm" />
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="videocam-outline"
              title={t('videos.empty')}
              description={query ? t('videos.emptySearch') : undefined}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.xs },
  title: { ...typography.h1, color: colors.text },
  subtitle: { color: colors.textMuted, fontSize: 15 },
  searchWrap: { marginTop: spacing.md },
  chipsList: { flexGrow: 0, flexShrink: 0 },
  chips: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  grid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  row: { flexDirection: 'row', gap: spacing.md },
  tile: { flex: 1 },
});

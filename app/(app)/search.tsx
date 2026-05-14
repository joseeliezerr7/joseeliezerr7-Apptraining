import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { SearchBar } from '@/components/SearchBar';
import { VideoCard } from '@/components/VideoCard';
import { ManualCard } from '@/components/ManualCard';
import { EmptyState } from '@/components/EmptyState';
import { fetchManuals, fetchVideos } from '@/lib/api';
import type { Manual, Video } from '@/lib/supabase';
import { colors, spacing, typography } from '@/constants/theme';

type Row =
  | { kind: 'video'; data: Video }
  | { kind: 'manual'; data: Manual };

export default function SearchScreen() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [manuals, setManuals] = useState<Manual[]>([]);

  useEffect(() => {
    Promise.all([fetchVideos(), fetchManuals()])
      .then(([v, m]) => {
        setVideos(v);
        setManuals(m);
      })
      .catch(() => {});
  }, []);

  const results = useMemo<Row[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const lang = i18n.language as 'en' | 'es';
    const v: Row[] = videos
      .filter((x) =>
        (lang === 'es' ? x.title_es : x.title_en).toLowerCase().includes(q)
      )
      .map((data) => ({ kind: 'video', data }));
    const m: Row[] = manuals
      .filter((x) =>
        (lang === 'es' ? x.title_es : x.title_en).toLowerCase().includes(q)
      )
      .map((data) => ({ kind: 'manual', data }));
    return [...v, ...m];
  }, [query, videos, manuals, i18n.language]);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('search.title')}</Text>
        <Text style={styles.subtitle}>{t('search.subtitle')}</Text>
        <View style={styles.searchWrap}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={t('search.placeholder')}
          />
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(it) => `${it.kind}-${it.data.id}`}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) =>
          item.kind === 'video' ? (
            <VideoCard video={item.data} size="lg" />
          ) : (
            <ManualCard manual={item.data} />
          )
        }
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title={query ? t('search.emptyTitle') : t('search.startTitle')}
            description={query ? t('search.emptyDesc') : t('search.startDesc')}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.xs },
  title: { ...typography.h1, color: colors.text },
  subtitle: { color: colors.textMuted, fontSize: 15 },
  searchWrap: { marginTop: spacing.md, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.md },
});

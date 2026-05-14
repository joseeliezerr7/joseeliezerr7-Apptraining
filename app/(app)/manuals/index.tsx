import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { CategoryChip } from '@/components/CategoryChip';
import { ManualCard } from '@/components/ManualCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { ManualCardSkeleton } from '@/components/Skeleton';
import { useToast } from '@/components/Toast';
import { fetchManuals } from '@/lib/api';
import type { Manual } from '@/lib/supabase';
import { colors, spacing, typography } from '@/constants/theme';

type LangFilter = 'all' | 'en' | 'es';

export default function ManualsIndex() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [filter, setFilter] = useState<LangFilter>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (lang: LangFilter) => {
      try {
        const arg = lang === 'all' ? undefined : lang;
        const data = await fetchManuals(arg);
        setManuals(data);
      } catch (err: any) {
        toast.error(err?.message ?? 'Failed to load manuals');
      }
    },
    [toast]
  );

  useEffect(() => {
    setLoading(true);
    load(filter).finally(() => setLoading(false));
  }, [filter, load]);

  async function onRefresh() {
    setRefreshing(true);
    await load(filter);
    setRefreshing(false);
  }

  const filtered = useMemo(() => {
    const lang = i18n.language as 'en' | 'es';
    const q = query.trim().toLowerCase();
    if (!q) return manuals;
    return manuals.filter((m) => {
      const title = (lang === 'es' ? m.title_es : m.title_en).toLowerCase();
      return title.includes(q);
    });
  }, [manuals, query, i18n.language]);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('manuals.title')}</Text>
        <Text style={styles.subtitle}>{t('manuals.subtitle')}</Text>
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChange={setQuery} />
        </View>
      </View>

      <View style={styles.chips}>
        <CategoryChip
          label={t('manuals.all')}
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <CategoryChip
          label="EN"
          selected={filter === 'en'}
          onPress={() => setFilter('en')}
        />
        <CategoryChip
          label="ES"
          selected={filter === 'es'}
          onPress={() => setFilter('es')}
        />
      </View>

      {loading ? (
        <View style={styles.list}>
          <ManualCardSkeleton />
          <ManualCardSkeleton />
          <ManualCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />
          }
          renderItem={({ item }) => <ManualCard manual={item} />}
          ListEmptyComponent={
            <EmptyState
              icon="library-outline"
              title={t('manuals.empty')}
              description={query ? t('manuals.emptySearch') : undefined}
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
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
});

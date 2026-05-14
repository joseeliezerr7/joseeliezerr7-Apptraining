import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { VideoCard } from '@/components/VideoCard';
import { ManualCard } from '@/components/ManualCard';
import { CategoryTile } from '@/components/CategoryTile';
import { useAuth } from '@/lib/auth';
import {
  fetchCategories,
  fetchManuals,
  fetchVideos,
  USING_MOCKS,
} from '@/lib/api';
import { listContinueWatching } from '@/lib/progress';
import type { Manual, Video, VideoCategory } from '@/lib/supabase';
import { colors, spacing, typography } from '@/constants/theme';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [continueVideos, setContinueVideos] = useState<Video[]>([]);
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const [c, v, m] = await Promise.all([
      fetchCategories(),
      fetchVideos(),
      fetchManuals(),
    ]);
    setCategories(c);
    setVideos(v);
    setManuals(m.slice(0, 3));

    if (user) {
      const progress = await listContinueWatching(user.id, 8).catch(() => []);
      const byId = new Map(v.map((x) => [x.id, x] as const));
      setContinueVideos(progress.map((p) => byId.get(p.video_id)).filter(Boolean) as Video[]);
    }
  }

  useEffect(() => {
    load().catch((e) => console.warn('home load error', e));
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await load().catch(() => {});
    setRefreshing(false);
  }

  const featured = videos[0];

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
          />
        }
      >
        <View style={styles.header}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.greeting}>{t('home.title')}</Text>
            <Text style={styles.name}>{profile?.full_name ?? ''}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/search')}
            style={({ pressed }) => [styles.searchBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="search" size={22} color={colors.text} />
          </Pressable>
        </View>

        {USING_MOCKS ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Demo data — set EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY in .env to connect Supabase.
            </Text>
          </View>
        ) : null}

        {featured ? (
          <View style={styles.featuredWrap}>
            <SectionHeader title={t('home.featured')} />
            <VideoCard video={featured} size="lg" />
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionHeader title={t('home.categories')} />
          <View style={styles.grid}>
            {categories.map((c) => (
              <View key={c.id} style={styles.gridItem}>
                <CategoryTile category={c} />
              </View>
            ))}
          </View>
        </View>

        {continueVideos.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title={t('home.continueWatching')} />
            <FlatList
              data={continueVideos}
              horizontal
              keyExtractor={(v) => v.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.lg, paddingRight: spacing.lg, alignItems: 'flex-start' }}
              style={{ flexGrow: 0 }}
              renderItem={({ item }) => <VideoCard video={item} size="md" />}
            />
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionHeader title={t('home.latestManuals')} />
          <View style={{ gap: spacing.md }}>
            {manuals.map((m) => (
              <ManualCard key={m.id} manual={m} />
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.lg, gap: spacing.xl },
  header: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  greeting: { color: colors.textMuted, ...typography.caption },
  name: { ...typography.h1, color: colors.text },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notice: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.bgElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
  },
  noticeText: { color: colors.textMuted, ...typography.caption },
  featuredWrap: { paddingHorizontal: spacing.lg },
  section: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { width: '48%', flexGrow: 1, height: 120 },
});

import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { VideoCard } from '@/components/VideoCard';
import { fetchCategories, fetchVideos } from '@/lib/api';
import type { Video, VideoCategory } from '@/lib/supabase';
import { colors, spacing, typography } from '@/constants/theme';

export default function CategoryVideos() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [cat, setCat] = useState<VideoCategory | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchVideos(category)])
      .then(([cs, vs]) => {
        setCat(cs.find((c) => c.slug === category) ?? null);
        setVideos(vs);
      })
      .catch((e) => console.warn(e));
  }, [category]);

  const title = cat
    ? i18n.language === 'es'
      ? cat.name_es
      : cat.name_en
    : '';

  return (
    <Screen padded={false}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>

      <FlatList
        data={videos}
        keyExtractor={(v) => v.id}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.md }}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <VideoCard video={item} size="sm" />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('videos.empty')}</Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  back: { padding: 4 },
  title: { ...typography.h2, color: colors.text },
  grid: { padding: spacing.lg, gap: spacing.lg },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
});

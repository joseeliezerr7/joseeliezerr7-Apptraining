import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';
import type { VideoCategory } from '@/lib/supabase';

export function CategoryTile({ category }: { category: VideoCategory }) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const name = i18n.language === 'es' ? category.name_es : category.name_en;
  return (
    <Pressable
      onPress={() => router.push(`/videos/${category.slug}`)}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      {category.thumbnail_url ? (
        <Image
          source={category.thumbnail_url}
          contentFit="cover"
          transition={200}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.fallback]} />
      )}
      <View style={styles.scrim} />
      <Text style={styles.label}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    height: '100%',
    minHeight: 120,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  pressed: { opacity: 0.9 },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,15,26,0.45)',
  },
  fallback: { backgroundColor: colors.surfaceAlt },
  label: { ...typography.h3, color: '#fff' },
});

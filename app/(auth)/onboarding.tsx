import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing, typography } from '@/constants/theme';

const ONBOARDING_KEY = 'app.onboarded';

export async function hasSeenOnboarding(): Promise<boolean> {
  const v = await AsyncStorage.getItem(ONBOARDING_KEY);
  return v === '1';
}

export async function markOnboarded(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, '1');
}

type Slide = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
};

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const slides: Slide[] = [
    {
      icon: 'videocam',
      title: t('onboarding.s1.title'),
      body: t('onboarding.s1.body'),
    },
    {
      icon: 'library',
      title: t('onboarding.s2.title'),
      body: t('onboarding.s2.body'),
    },
    {
      icon: 'globe',
      title: t('onboarding.s3.title'),
      body: t('onboarding.s3.body'),
    },
  ];

  const { width } = Dimensions.get('window');

  async function finish() {
    await markOnboarded();
    router.replace('/(auth)/login');
  }

  function next() {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      finish();
    }
  }

  function onViewableChanged({ viewableItems }: { viewableItems: ViewToken[] }) {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0]!.index ?? 0);
    }
  }

  return (
    <Screen padded={false}>
      <View style={styles.skipRow}>
        <Pressable onPress={finish} hitSlop={12}>
          <Text style={styles.skip}>{t('onboarding.skip')}</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={56} color="#fff" />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
        <Button
          label={index === slides.length - 1 ? t('onboarding.cta') : t('onboarding.next')}
          onPress={next}
          fullWidth
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  skipRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, alignItems: 'flex-end' },
  skip: { color: colors.textMuted, fontWeight: '700' },
  slide: { padding: spacing.xl, gap: spacing.lg, alignItems: 'center', justifyContent: 'center', flex: 1 },
  iconWrap: {
    width: 128,
    height: 128,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h1, color: colors.text, textAlign: 'center' },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 360,
  },
  footer: { padding: spacing.xl, gap: spacing.lg },
  dots: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceAlt,
  },
  dotActive: { backgroundColor: colors.primary, width: 22 },
});

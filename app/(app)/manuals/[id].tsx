import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { CategoryChip } from '@/components/CategoryChip';
import { BookmarkButton } from '@/components/BookmarkButton';
import { useToast } from '@/components/Toast';
import { fetchManual } from '@/lib/api';
import { downloadAndShare } from '@/lib/download';
import type { Manual } from '@/lib/supabase';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function ManualDetail() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [manual, setManual] = useState<Manual | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>(
    (i18n.language as 'en' | 'es') ?? 'en'
  );

  useEffect(() => {
    fetchManual(String(id))
      .then((m) => {
        setManual(m);
        if (m) {
          if (!m.pdf_url_en && m.pdf_url_es) setLang('es');
          else if (!m.pdf_url_es && m.pdf_url_en) setLang('en');
        }
      })
      .catch((e) => console.warn(e))
      .finally(() => setLoading(false));
  }, [id]);

  const pdfUrl = useMemo(() => {
    if (!manual) return null;
    return lang === 'es' ? manual.pdf_url_es : manual.pdf_url_en;
  }, [manual, lang]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.text} style={{ marginTop: spacing.xxl }} />
      </Screen>
    );
  }

  if (!manual) {
    return (
      <Screen>
        <Text style={{ color: colors.text }}>Not found</Text>
      </Screen>
    );
  }

  const title = i18n.language === 'es' ? manual.title_es : manual.title_en;
  const desc =
    i18n.language === 'es' ? manual.description_es : manual.description_en;

  async function openExternal() {
    if (!pdfUrl) return;
    if (Platform.OS === 'web') {
      window.open(pdfUrl, '_blank');
    } else {
      await WebBrowser.openBrowserAsync(pdfUrl).catch(() =>
        Linking.openURL(pdfUrl)
      );
    }
  }

  async function onDownload() {
    if (!pdfUrl || !manual) return;
    const baseTitle = lang === 'es' ? manual.title_es : manual.title_en;
    const filename = `${baseTitle}-${lang}.pdf`;
    try {
      setDownloading(true);
      await downloadAndShare(pdfUrl, filename);
      if (Platform.OS !== 'web') toast.success(t('manuals.downloaded'));
    } catch (err: any) {
      toast.error(err?.message ?? 'Download failed');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Screen padded={false}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <BookmarkButton type="manual" id={manual.id} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.heroRow}>
          <Image
            source={manual.thumbnail_url}
            style={styles.thumb}
            contentFit="cover"
            transition={200}
          />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Text style={styles.title}>{title}</Text>
            {manual.page_count ? (
              <Text style={styles.meta}>
                {manual.page_count} {t('manuals.pages')}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.langChips}>
          <Text style={styles.langLabel}>{t('manuals.language')}</Text>
          {manual.pdf_url_en ? (
            <CategoryChip
              label="English"
              selected={lang === 'en'}
              onPress={() => setLang('en')}
            />
          ) : null}
          {manual.pdf_url_es ? (
            <CategoryChip
              label="Español"
              selected={lang === 'es'}
              onPress={() => setLang('es')}
            />
          ) : null}
        </View>

        {desc ? <Text style={styles.desc}>{desc}</Text> : null}

        {pdfUrl ? (
          <>
            <View style={styles.viewerCard}>
              {Platform.OS === 'web' ? (
                <iframe
                  src={pdfUrl}
                  style={{
                    width: '100%',
                    height: 600,
                    border: 'none',
                    borderRadius: 14,
                    background: '#fff',
                  }}
                />
              ) : (
                <WebView
                  source={{
                    uri:
                      Platform.OS === 'android'
                        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`
                        : pdfUrl,
                  }}
                  style={{ flex: 1, backgroundColor: '#fff' }}
                  startInLoadingState
                />
              )}
            </View>
            <View style={styles.actions}>
              <Button
                label={t('manuals.openPdf')}
                onPress={openExternal}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <Button
                label={t('manuals.downloadPdf')}
                onPress={onDownload}
                loading={downloading}
                style={{ flex: 1 }}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  heroRow: { flexDirection: 'row', gap: spacing.lg },
  thumb: {
    width: 110,
    height: 150,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  title: { ...typography.h2, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted },
  langChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  langLabel: { color: colors.textMuted, ...typography.caption, marginRight: spacing.xs },
  desc: { color: colors.text, lineHeight: 22 },
  viewerCard: {
    height: 600,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actions: { flexDirection: 'row', gap: spacing.md },
});

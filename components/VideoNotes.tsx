import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import { getNotes, saveNotes } from '@/lib/notes';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';

type Props = { videoId: string };

export function VideoNotes({ videoId }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;
    getNotes(user.id, videoId)
      .then((c) => setContent(c))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [user, videoId]);

  function onChange(next: string) {
    setContent(next);
    setStatus('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!user) return;
      try {
        await saveNotes(user.id, videoId, next);
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 1500);
      } catch {
        setStatus('idle');
      }
    }, 600);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('videos.notesTitle')}</Text>
        {status === 'saving' ? (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={colors.textMuted} />
            <Text style={styles.status}>{t('videos.notesSaving')}</Text>
          </View>
        ) : status === 'saved' ? (
          <View style={styles.statusRow}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={[styles.status, { color: colors.success }]}>
              {t('videos.notesSaved')}
            </Text>
          </View>
        ) : null}
      </View>
      <TextInput
        value={content}
        onChangeText={onChange}
        editable={loaded}
        placeholder={t('videos.notesPlaceholder')}
        placeholderTextColor={colors.textSubtle}
        multiline
        textAlignVertical="top"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadow.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  status: { ...typography.caption, color: colors.textMuted },
  input: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 96,
    padding: 0,
  },
});

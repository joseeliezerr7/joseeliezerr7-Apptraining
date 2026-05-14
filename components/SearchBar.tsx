import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, radius, spacing } from '@/constants/theme';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.field}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        placeholder={placeholder ?? t('common.search')}
        placeholderTextColor={colors.textSubtle}
        value={value}
        onChangeText={onChange}
        style={styles.input}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChange('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 44,
  },
  input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 0 },
});

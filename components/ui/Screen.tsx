import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edges } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing } from '@/constants/theme';

type Props = ViewProps & {
  padded?: boolean;
  edges?: Edges;
};

export function Screen({
  padded = true,
  edges = ['top', 'bottom'],
  style,
  children,
  ...rest
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <StatusBar style="light" />
      <View {...rest} style={[styles.body, padded && styles.padded, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, backgroundColor: colors.bg },
  padded: { paddingHorizontal: spacing.lg },
});

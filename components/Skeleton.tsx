import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius } from '@/constants/theme';

type Props = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius: br = radius.sm,
  style,
}: Props) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width: width as ViewStyle['width'], height, borderRadius: br, opacity: pulse },
        style,
      ]}
    />
  );
}

export function VideoCardSkeleton({ width = 240 }: { width?: number }) {
  return (
    <View style={{ width, gap: 8 }}>
      <Skeleton width={width} height={(width as number) * 0.5625} borderRadius={radius.lg} />
      <Skeleton width="80%" height={14} />
      <Skeleton width="50%" height={12} />
    </View>
  );
}

export function ManualCardSkeleton() {
  return (
    <View style={styles.manualRow}>
      <Skeleton width={80} height={110} borderRadius={radius.md} />
      <View style={{ flex: 1, gap: 8, justifyContent: 'space-between' }}>
        <Skeleton width="90%" height={16} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.surfaceAlt },
  manualRow: {
    flexDirection: 'row',
    gap: 16,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

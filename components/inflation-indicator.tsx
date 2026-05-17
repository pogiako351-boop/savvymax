import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { INFLATION_RATE } from '@/constants/BankData';

interface InflationIndicatorProps {
  depositAmount: number;
}

export function InflationIndicator({ depositAmount }: InflationIndicatorProps) {
  const annualLoss = (depositAmount * INFLATION_RATE) / 100;
  const perMinute = annualLoss / (365 * 24 * 60);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inflation Bleed Indicator</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⚠️</Text>
        </View>
      </View>
      <Text style={styles.description}>
        Estimated purchasing power loss:
      </Text>
      <Text style={styles.lossAmount}>
        -${annualLoss.toFixed(2)}/year at {INFLATION_RATE}% inflation.
      </Text>
      <Text style={styles.perMinute}>
        That&apos;s ${perMinute.toFixed(4)}/minute bleeding away.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardSurface,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentRed,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 14,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
  },
  lossAmount: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.accentRed,
    fontVariant: ['tabular-nums'],
  },
  perMinute: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textDark,
    fontVariant: ['tabular-nums'],
  },
});

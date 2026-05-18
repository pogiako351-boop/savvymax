import React, { useState, useEffect, useRef } from 'react';
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
  const perSecond = annualLoss / (365 * 24 * 60 * 60);

  const [tickerAmount, setTickerAmount] = useState(0);
  const startTimeRef = useRef(Date.now());

  // Reset ticker when deposit amount changes
  useEffect(() => {
    startTimeRef.current = Date.now();
    setTickerAmount(0);
  }, [depositAmount]);

  // Real-time per-second ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTickerAmount(elapsed * perSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [perSecond]);

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
      <Text selectable style={styles.lossAmount}>
        -${annualLoss.toFixed(2)}/year at {INFLATION_RATE}% inflation
      </Text>
      <View style={styles.tickerRow}>
        <View style={styles.tickerDot} />
        <Text style={styles.perMinute}>
          ${perMinute.toFixed(4)}/min bleeding away
        </Text>
      </View>
      <View style={styles.liveCounter}>
        <Text style={styles.liveLabel}>Lost since you opened this page:</Text>
        <Text selectable style={styles.liveAmount}>
          -${tickerAmount.toFixed(6)}
        </Text>
      </View>
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
    gap: 8,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    fontSize: 18,
    color: Colors.accentRed,
    fontVariant: ['tabular-nums'],
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tickerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentRed,
  },
  perMinute: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  liveCounter: {
    marginTop: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 10,
    borderCurve: 'continuous',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textDark,
    flex: 1,
  },
  liveAmount: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.accentRed,
    fontVariant: ['tabular-nums'],
  },
});

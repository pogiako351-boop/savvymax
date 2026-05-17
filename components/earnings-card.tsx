import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { BURRITO_COST, STREAMING_MONTHLY, FLIGHT_COST } from '@/constants/BankData';
import type { Bank } from '@/constants/BankData';

interface EarningsCardProps {
  bank: Bank;
  grossEarnings: number;
  netEarnings: number;
  maxEarnings: number;
  feeWarning: boolean;
}

export function EarningsCard({
  bank,
  grossEarnings,
  netEarnings,
  maxEarnings,
  feeWarning,
}: EarningsCardProps) {
  const barWidth = maxEarnings > 0 ? (netEarnings / maxEarnings) * 100 : 0;
  const burritos = Math.floor(netEarnings / BURRITO_COST);
  const streamingMonths = Math.floor(netEarnings / STREAMING_MONTHLY);
  const flights = Math.floor(netEarnings / FLIGHT_COST);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bankName}>{bank.name}</Text>
        <Text style={styles.apyLabel}>{bank.apy.toFixed(2)}%</Text>
      </View>

      <View style={styles.earningsRow}>
        <Text style={styles.label}>Gross APY Earnings:</Text>
        <Text selectable style={styles.grossValue}>
          ${grossEarnings.toFixed(2)} ({bank.apy.toFixed(2)}%)
        </Text>
      </View>

      {bank.annualFee ? (
        <View style={styles.earningsRow}>
          <Text style={styles.label}>Annual Fee:</Text>
          <Text selectable style={styles.feeValue}>-${bank.annualFee.toFixed(2)}</Text>
        </View>
      ) : null}

      <View style={styles.netRow}>
        <Text style={styles.netLabel}>Net Annual Earnings:</Text>
        <Text selectable style={[styles.netValue, feeWarning && styles.netWarning]}>
          ${netEarnings.toFixed(2)}
        </Text>
      </View>

      {/* Earnings bar */}
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${Math.max(barWidth, 2)}%` }]} />
        <Text style={styles.barLabel}>{Math.round(barWidth)}% of max yield</Text>
      </View>

      {/* Lifestyle conversion */}
      {netEarnings > 0 && (
        <View style={styles.lifestyleSection}>
          <Text style={styles.lifestyleTitle}>Lifestyle Conversion Translator</Text>
          <View style={styles.lifestyleRow}>
            <Text style={styles.lifestyleItem}>
              🌯 {burritos} free burritos/year (${BURRITO_COST}/ea)
            </Text>
          </View>
          <View style={styles.lifestyleRow}>
            <Text style={styles.lifestyleItem}>
              📺 {streamingMonths} months of streaming (${STREAMING_MONTHLY}/mo)
            </Text>
          </View>
          <View style={styles.lifestyleRow}>
            <Text style={styles.lifestyleItem}>
              ✈️ {flights} domestic flight{flights !== 1 ? 's' : ''} (${FLIGHT_COST}/ea)
            </Text>
          </View>
        </View>
      )}

      {feeWarning && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            ⚠️ Annual fee exceeds yield at this deposit amount
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardSurface,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  apyLabel: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.accentGreen,
    fontVariant: ['tabular-nums'],
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
  },
  grossValue: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  feeValue: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.accentRed,
    fontVariant: ['tabular-nums'],
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  netLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  netValue: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.accentGreen,
    fontVariant: ['tabular-nums'],
  },
  netWarning: {
    color: Colors.accentRed,
  },
  barContainer: {
    gap: 4,
    marginTop: 4,
  },
  bar: {
    height: 6,
    backgroundColor: Colors.accentGreen,
    borderRadius: 3,
    borderCurve: 'continuous',
  },
  barLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textDark,
    textAlign: 'right',
  },
  lifestyleSection: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 6,
  },
  lifestyleTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  lifestyleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lifestyleItem: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  warningBanner: {
    marginTop: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: 10,
  },
  warningText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.accentRed,
    textAlign: 'center',
  },
});

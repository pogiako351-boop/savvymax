import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
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
  isBestPick: boolean;
}

export function EarningsCard({
  bank,
  grossEarnings,
  netEarnings,
  maxEarnings,
  feeWarning,
  isBestPick,
}: EarningsCardProps) {
  const barWidth = maxEarnings > 0 ? (netEarnings / maxEarnings) * 100 : 0;
  const burritos = Math.floor(netEarnings / BURRITO_COST);
  const streamingMonths = Math.floor(netEarnings / STREAMING_MONTHLY);
  const flights = Math.floor(netEarnings / FLIGHT_COST);

  return (
    <View style={[styles.container, isBestPick && styles.bestPickContainer]}>
      {isBestPick && (
        <View style={styles.bestPickBanner}>
          <Text style={styles.bestPickBannerText}>⭐ Best Pick: {bank.name}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.bankName, isBestPick && styles.bestPickBankName]}>
            {bank.name}
          </Text>
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
          <View style={styles.barTrack}>
            <View
              style={[
                styles.bar,
                { width: `${Math.max(barWidth, 2)}%` },
                isBestPick && styles.bestPickBar,
              ]}
            />
          </View>
          <Text style={styles.barLabel}>{Math.round(barWidth)}% of max yield</Text>
        </View>

        {/* Lifestyle conversion */}
        {netEarnings > 0 && (
          <View style={styles.lifestyleSection}>
            <Text style={styles.lifestyleTitle}>Lifestyle Conversion Translator</Text>
            <Text style={styles.lifestyleItem}>
              🌯 {burritos} free burritos/year (${BURRITO_COST}/ea)
            </Text>
            <Text style={styles.lifestyleItem}>
              📺 {streamingMonths} months of streaming (${STREAMING_MONTHLY}/mo)
            </Text>
            <Text style={styles.lifestyleItem}>
              ✈️ {flights} domestic flight{flights !== 1 ? 's' : ''} (${FLIGHT_COST}/ea)
            </Text>
          </View>
        )}

        {feeWarning && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              ⚠️ Annual fee exceeds yield at this deposit amount
            </Text>
          </View>
        )}

        {/* CTA */}
        {bank.cat !== 'Traditional' && netEarnings > 0 ? (
          <Pressable
            onPress={() => Linking.openURL(bank.url)}
            style={({ pressed }) => [
              styles.cardCta,
              pressed && styles.cardCtaPressed,
            ]}
            accessibilityRole="link"
          >
            <Text style={styles.cardCtaText}>Open Account →</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardSurface,
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
  },
  bestPickContainer: {
    borderWidth: 1.5,
    borderColor: Colors.goldHighlight,
    boxShadow: '0 0 20px rgba(245, 158, 11, 0.15), 0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  bestPickBanner: {
    backgroundColor: Colors.goldHighlight,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  bestPickBannerText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#000',
    letterSpacing: 0.3,
  },
  content: {
    padding: 18,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankName: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  bestPickBankName: {
    color: Colors.goldHighlight,
  },
  apyLabel: {
    fontFamily: Fonts.bold,
    fontSize: 15,
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
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  netLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  netValue: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.accentGreen,
    fontVariant: ['tabular-nums'],
  },
  netWarning: {
    color: Colors.accentRed,
  },
  barContainer: {
    gap: 6,
    marginTop: 4,
  },
  barTrack: {
    height: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: 4,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  bar: {
    height: 8,
    backgroundColor: Colors.accentGreen,
    borderRadius: 4,
    borderCurve: 'continuous',
  },
  bestPickBar: {
    backgroundColor: Colors.goldHighlight,
  },
  barLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textDark,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  lifestyleSection: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 7,
  },
  lifestyleTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  lifestyleItem: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  warningBanner: {
    marginTop: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: 10,
    borderCurve: 'continuous',
    padding: 12,
  },
  warningText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.accentRed,
    textAlign: 'center',
  },
  cardCta: {
    marginTop: 6,
    backgroundColor: Colors.accentGreen,
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingVertical: 12,
    alignItems: 'center',
  },
  cardCtaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardCtaText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#000',
    letterSpacing: 0.3,
  },
});

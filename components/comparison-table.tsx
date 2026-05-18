import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { CategoryBadge } from './category-badge';
import { AdPlaceholder } from './ad-placeholder';
import type { Bank } from '@/constants/BankData';

interface RankedBank extends Bank {
  rank: number;
  grossEarnings: number;
  netEarnings: number;
  chaseDelta: number;
  feeWarning: boolean;
}

interface ComparisonTableProps {
  rankedBanks: RankedBank[];
}

function CtaButton({ bank }: { bank: RankedBank }) {
  if (bank.cat === 'Traditional') {
    return (
      <View style={styles.ctaDisabled}>
        <Text style={styles.ctaDisabledText}>Low-Yield Trap</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => Linking.openURL(bank.url)}
      style={({ pressed }) => [
        styles.ctaButton,
        pressed && styles.ctaPressed,
      ]}
      accessibilityRole="link"
    >
      <Text style={styles.ctaText}>Claim High Rate →</Text>
    </Pressable>
  );
}

export function ComparisonTable({ rankedBanks }: ComparisonTableProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ranked APY Comparison Table</Text>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { width: 28 }]}>#</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Bank Name</Text>
        <Text style={[styles.headerCell, { width: 55, textAlign: 'right' }]}>APY %</Text>
        <Text style={[styles.headerCell, { width: 80, textAlign: 'right' }]}>Annual $</Text>
        <Text style={[styles.headerCell, { width: 65, textAlign: 'right' }]}>vs Chase</Text>
      </View>

      {rankedBanks.map((bank, index) => (
        <React.Fragment key={bank.id}>
          {/* Inject in-feed ad between 5th and 6th row */}
          {index === 5 && <AdPlaceholder variant="in-feed" />}

          <View
            style={[
              styles.row,
              index === 0 && styles.bestPickRow,
            ]}
          >
            {index === 0 && (
              <View style={styles.bestPickBadge}>
                <Text style={styles.bestPickText}>⭐ Best Pick</Text>
              </View>
            )}
            <View style={styles.rowContent}>
              <Text style={[styles.rank, index === 0 && styles.bestPickRank]}>
                {bank.rank}
              </Text>
              <View style={styles.bankInfo}>
                <Text
                  style={[styles.bankName, index === 0 && styles.bestPickName]}
                  numberOfLines={1}
                >
                  {bank.name}
                </Text>
                <CategoryBadge category={bank.cat} />
                {bank.req ? (
                  <Text style={styles.requirements} numberOfLines={1}>
                    {bank.req}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.apy, index === 0 && styles.bestPickApy]}>
                {bank.apy.toFixed(2)}%
              </Text>
              <View style={styles.earningsCol}>
                <Text
                  selectable
                  style={[
                    styles.earnings,
                    index === 0 && styles.bestPickEarnings,
                    bank.feeWarning && styles.warningText,
                  ]}
                >
                  ${bank.netEarnings.toFixed(2)}
                </Text>
                {bank.annualFee ? (
                  <Text style={styles.feeNote}>
                    (net after ${bank.annualFee}/yr)
                  </Text>
                ) : null}
                {bank.feeWarning && (
                  <Text style={styles.feeWarningBadge}>⚠️ Fee &gt; Yield</Text>
                )}
              </View>
              <Text
                selectable
                style={[
                  styles.delta,
                  bank.chaseDelta > 0 ? styles.deltaPositive : styles.deltaNeutral,
                ]}
              >
                {bank.chaseDelta > 0 ? '+' : ''}${bank.chaseDelta.toFixed(2)}
              </Text>
            </View>
            {/* CTA Button */}
            <View style={styles.ctaRow}>
              <CtaButton bank={bank} />
            </View>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCell: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: Colors.textDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    backgroundColor: Colors.cardSurface,
    borderRadius: 14,
    borderCurve: 'continuous',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  bestPickRow: {
    borderWidth: 1.5,
    borderColor: Colors.goldHighlight,
    boxShadow: '0 0 24px rgba(245, 158, 11, 0.2), 0 4px 12px rgba(245, 158, 11, 0.1)',
  },
  bestPickBadge: {
    backgroundColor: Colors.goldHighlight,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  bestPickText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#000',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 8,
  },
  rank: {
    width: 22,
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  bestPickRank: {
    color: Colors.goldHighlight,
  },
  bankInfo: {
    flex: 1,
    gap: 4,
  },
  bankName: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  bestPickName: {
    color: Colors.goldHighlight,
  },
  requirements: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: Colors.textDark,
    marginTop: 1,
  },
  apy: {
    width: 52,
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.accentGreen,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  bestPickApy: {
    color: Colors.accentGreen,
  },
  earningsCol: {
    width: 80,
    alignItems: 'flex-end',
    gap: 2,
  },
  earnings: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  bestPickEarnings: {
    color: Colors.goldHighlight,
  },
  warningText: {
    color: Colors.accentRed,
  },
  feeNote: {
    fontFamily: Fonts.regular,
    fontSize: 9,
    color: Colors.textDark,
  },
  feeWarningBadge: {
    fontFamily: Fonts.semiBold,
    fontSize: 9,
    color: Colors.accentRed,
  },
  delta: {
    width: 62,
    fontFamily: Fonts.bold,
    fontSize: 13,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  deltaPositive: {
    color: Colors.accentGreen,
  },
  deltaNeutral: {
    color: Colors.textDark,
  },
  ctaRow: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
  },
  ctaButton: {
    backgroundColor: Colors.accentGreen,
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#000',
    letterSpacing: 0.3,
  },
  ctaDisabled: {
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabledText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.textDark,
    letterSpacing: 0.3,
  },
});

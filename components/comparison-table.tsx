import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { CategoryBadge } from './category-badge';
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

export function ComparisonTable({ rankedBanks }: ComparisonTableProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ranked APY Comparison Table</Text>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { width: 28 }]}>#</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Bank Name</Text>
        <Text style={[styles.headerCell, { width: 55, textAlign: 'right' }]}>APY %</Text>
        <Text style={[styles.headerCell, { width: 75, textAlign: 'right' }]}>Annual</Text>
        <Text style={[styles.headerCell, { width: 65, textAlign: 'right' }]}>vs Chase</Text>
      </View>

      {rankedBanks.map((bank, index) => (
        <View
          key={bank.id}
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
                ${bank.netEarnings.toFixed(0)}
              </Text>
              {bank.annualFee ? (
                <Text style={styles.feeNote}>
                  (net after ${bank.annualFee}/yr fee)
                </Text>
              ) : null}
              {bank.feeWarning && (
                <Text style={styles.feeWarningBadge}>⚠️ Fee {'>'} Yield</Text>
              )}
            </View>
            <Text
              selectable
              style={[
                styles.delta,
                bank.chaseDelta > 0 ? styles.deltaPositive : styles.deltaNeutral,
              ]}
            >
              {bank.chaseDelta > 0 ? '+' : ''}${bank.chaseDelta.toFixed(0)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  bestPickRow: {
    borderWidth: 1.5,
    borderColor: Colors.goldHighlight,
    boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)',
  },
  bestPickBadge: {
    backgroundColor: Colors.goldHighlight,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  bestPickText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#000',
    letterSpacing: 0.3,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  rank: {
    width: 22,
    fontFamily: Fonts.bold,
    fontSize: 14,
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
    fontSize: 13,
    color: Colors.textPrimary,
  },
  bestPickName: {
    color: Colors.goldHighlight,
  },
  requirements: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: Colors.textDark,
  },
  apy: {
    width: 52,
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.accentGreen,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  bestPickApy: {
    color: Colors.accentGreen,
  },
  earningsCol: {
    width: 75,
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
    width: 58,
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
});

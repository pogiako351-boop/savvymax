import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { bankDataset } from '@/constants/BankData';
import { DepositInput } from '@/components/deposit-input';
import { InflationIndicator } from '@/components/inflation-indicator';
import { ComparisonTable } from '@/components/comparison-table';
import { EarningsCard } from '@/components/earnings-card';

function calculateEarnings(apy: number, deposit: number, annualFee?: number) {
  const gross = (deposit * apy) / 100;
  const net = gross - (annualFee || 0);
  const feeWarning = annualFee ? annualFee > gross : false;
  return { gross, net, feeWarning };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [depositAmount, setDepositAmount] = useState(10000);

  const rankedBanks = useMemo(() => {
    const chaseEarnings = (depositAmount * 0.01) / 100;

    return bankDataset
      .map((bank) => {
        const { gross, net, feeWarning } = calculateEarnings(
          bank.apy,
          depositAmount,
          bank.annualFee
        );
        return {
          ...bank,
          grossEarnings: gross,
          netEarnings: net,
          chaseDelta: net - chaseEarnings,
          feeWarning,
          rank: 0,
        };
      })
      .sort((a, b) => b.netEarnings - a.netEarnings)
      .map((bank, index) => ({ ...bank, rank: index + 1 }));
  }, [depositAmount]);

  const maxEarnings = rankedBanks.length > 0 ? rankedBanks[0].netEarnings : 0;

  // Show top 5 in the earnings panel
  const topBanks = rankedBanks.slice(0, 6);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>US Savings Rate Hacker</Text>
        <Text style={styles.subtitle}>
          Maximize your cash deposits with zero backend.
        </Text>
      </View>

      {/* Deposit Input */}
      <DepositInput value={depositAmount} onValueChange={setDepositAmount} />

      {/* Inflation Bleed Indicator */}
      <InflationIndicator depositAmount={depositAmount} />

      {/* Comparison Table */}
      <ComparisonTable rankedBanks={rankedBanks} />

      {/* Annual Earnings Calculator Panel */}
      <View style={styles.earningsSection}>
        <Text style={styles.sectionTitle}>
          Annual Earnings Breakdown
        </Text>
        <Text style={styles.sectionSubtitle}>
          (${depositAmount.toLocaleString('en-US')} Deposit)
        </Text>

        {topBanks.map((bank) => (
          <EarningsCard
            key={bank.id}
            bank={bank}
            grossEarnings={bank.grossEarnings}
            netEarnings={bank.netEarnings}
            maxEarnings={maxEarnings}
            feeWarning={bank.feeWarning}
          />
        ))}
      </View>

      {/* Footer Disclaimer */}
      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          APY rates are subject to change. Calculations are estimates. Not financial advice.
          Rates last checked May 2026.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 16,
    gap: 20,
  },
  header: {
    gap: 6,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  earningsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: -8,
  },
  footer: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  disclaimer: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 16,
  },
});

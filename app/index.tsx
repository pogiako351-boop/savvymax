import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { bankDataset } from '@/constants/BankData';
import { DepositInput } from '@/components/deposit-input';
import { InflationIndicator } from '@/components/inflation-indicator';
import { ComparisonTable } from '@/components/comparison-table';
import { EarningsCard } from '@/components/earnings-card';
import { AdPlaceholder, AnchorAdBar } from '@/components/ad-placeholder';
import { LegalFooter } from '@/components/legal-footer';
import { SavvymaxLogo } from '@/components/savvymax-logo';

function calculateEarnings(apy: number, deposit: number, annualFee?: number) {
  const gross = (deposit * apy) / 100;
  const net = gross - (annualFee || 0);
  const feeWarning = annualFee ? annualFee > gross : false;
  return { gross, net, feeWarning };
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [depositAmount, setDepositAmount] = useState(10000);
  const [showAnchorAd, setShowAnchorAd] = useState(true);

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

  // Show top 6 in the earnings panel
  const topBanks = rankedBanks.slice(0, 6);

  const handleDismissAnchor = useCallback(() => {
    setShowAnchorAd(false);
  }, []);

  // Add bottom padding for anchor ad space
  const anchorHeight = showAnchorAd ? 76 : 0;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 40 + anchorHeight,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Leaderboard Ad */}
        <AdPlaceholder variant="leaderboard" />

        {/* Header */}
        <View style={styles.header}>
          <SavvymaxLogo />
          <Text style={styles.subtitle}>
            Maximize your cash deposits effortlessly.
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
          <View style={styles.earningsHeader}>
            <Text style={styles.sectionTitle}>Annual Earnings Breakdown</Text>
            <Text style={styles.sectionSubtitle}>
              ${depositAmount.toLocaleString('en-US')} Deposit
            </Text>
          </View>

          {topBanks.map((bank, index) => (
            <EarningsCard
              key={bank.id}
              bank={bank}
              grossEarnings={bank.grossEarnings}
              netEarnings={bank.netEarnings}
              maxEarnings={maxEarnings}
              feeWarning={bank.feeWarning}
              isBestPick={index === 0}
            />
          ))}
        </View>

        {/* Legal Footer */}
        <LegalFooter />
      </ScrollView>

      {/* Sticky Bottom Anchor Ad */}
      {showAnchorAd && (
        <View style={{ paddingBottom: insets.bottom }}>
          <AnchorAdBar onClose={handleDismissAnchor} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 22,
  },
  header: {
    gap: 8,
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  earningsSection: {
    gap: 14,
  },
  earningsHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
});

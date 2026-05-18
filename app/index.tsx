import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  useWindowDimensions,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/Typography';

// ─── US-ONLY CONSTANTS ────────────────────────────────────────────────────────

const INFLATION_RATE = 3.2;
const TRADITIONAL_BANK_APY = 0.01;
const MAX_BENCHMARK_YIELD = 4.50;
const CURRENCY_SYMBOL = '$';

const APP_TITLE = 'Savvymax';
const HERO_HEADER = 'Stop Losing Money to Inflation';
const HERO_SUBHEADER =
  'Your savings are bleeding purchasing power every second. See exactly how much — and how to fix it.';
const BLEED_TITLE = 'Inflation Bleed';
const BLEED_SUB = 'Your cash is losing value after bank interest';
const OPTIMIZER_TITLE = 'Optimized Yield Potential';
const CTA_TEXT = 'Find Best APY Rates';

const LEGAL = {
  DISCLAIMER:
    'Savvymax is an independent, advertising-supported comparison tool for US residents. APY rates shown are subject to change based on Federal Reserve policy, bank pricing, and market conditions. This is not financial advice. Verify rates directly with institutions before depositing. FDIC insurance applies up to $250,000 per depositor, per institution.',
  PRIVACY:
    'We do not collect personal financial data. Anonymous usage analytics (page views, deposit range) are collected via privacy-respecting analytics. No data is sold to third parties. AdSense may use cookies for ad personalization — you can opt out via Google Ad Settings.',
  TERMS:
    'By using Savvymax, you acknowledge this tool is for informational purposes only. We are not a bank, broker, or financial advisor. Affiliate links may earn us a commission at no cost to you. All trademarks belong to their respective owners.',
};

// ─── US BANK DATASET ──────────────────────────────────────────────────────────

interface BankEntry {
  id: string;
  name: string;
  apy: number;
  note?: string;
  url?: string;
  isLowYield?: boolean;
}

const US_BANK_DATASET: BankEntry[] = [
  { id: 'sofi', name: 'SoFi', apy: 4.50, url: 'https://sofi.com/banking' },
  { id: 'wealthfront', name: 'Wealthfront Cash', apy: 4.50, url: 'https://wealthfront.com/cash' },
  { id: 'cit', name: 'CIT Bank', apy: 4.50, url: 'https://cit.com/banking' },
  { id: 'marcus', name: 'Marcus by Goldman Sachs', apy: 4.40, url: 'https://marcus.com' },
  { id: 'robinhood', name: 'Robinhood Gold', apy: 4.40, note: 'Net after $60/yr fee', url: 'https://robinhood.com/gold' },
  { id: 'ally', name: 'Ally Bank', apy: 4.35, url: 'https://ally.com/bank/online-savings-account' },
  { id: 'barclays', name: 'Barclays Online Savings', apy: 4.35, url: 'https://barclays.com/savings' },
  { id: 'discover', name: 'Discover Online Savings', apy: 4.30, url: 'https://discover.com/online-banking/savings-account' },
  { id: 'amex', name: 'American Express HYSA', apy: 4.25, url: 'https://americanexpress.com/en-us/banking/online-savings' },
  { id: 'capital-one', name: 'Capital One 360', apy: 4.25, url: 'https://capitalone.com/bank/savings-accounts/online-performance-savings' },
  { id: 'chase', name: 'Chase Savings', apy: 0.01, isLowYield: true },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function SavvymaxUS() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 728;

  // State
  const [deposit, setDeposit] = useState('10000');
  const [bleed, setBleed] = useState(0);
  const [optimizedGain, setOptimizedGain] = useState(0);
  const [liveLost, setLiveLost] = useState(0);
  const [activeModal, setActiveModal] = useState<'disclaimer' | 'privacy' | 'terms' | 'banks' | null>(null);

  const depositAmount = Math.max(0, parseInt(deposit.replace(/[^0-9]/g, ''), 10) || 0);

  // Recalculate bleed & optimizedGain on deposit change
  useEffect(() => {
    const amount = depositAmount;
    const inflationLoss = (amount * INFLATION_RATE) / 100;
    const traditionalBankEarnings = (amount * TRADITIONAL_BANK_APY) / 100;
    const maxBenchmarkEarnings = (amount * MAX_BENCHMARK_YIELD) / 100;

    const newBleed = inflationLoss - traditionalBankEarnings;
    const newOptimizedGain = maxBenchmarkEarnings - traditionalBankEarnings;

    setBleed(newBleed);
    setOptimizedGain(newOptimizedGain);
    setLiveLost(0);
  }, [depositAmount]);

  // Interval ticker — increment liveLost every 100ms
  const bleedRef = useRef(bleed);
  bleedRef.current = bleed;

  useEffect(() => {
    const interval = setInterval(() => {
      const annualBleed = bleedRef.current;
      const increment = (annualBleed / (365 * 24 * 60 * 60)) * 0.1;
      setLiveLost((prev) => prev + increment);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Deposit input handler
  const handleDepositChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10) || 0;
    const clamped = Math.min(num, 10000000);
    setDeposit(clamped.toString());
  }, []);

  // CTA handler — opens bank comparison modal
  const handleCtaPress = useCallback(() => {
    setActiveModal('banks');
  }, []);

  // Open bank affiliate URL
  const handleBankPress = useCallback((url: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(url);
    }
  }, []);

  // Format helpers
  const formatCurrency = useCallback((amount: number, decimals = 2) => {
    return `${CURRENCY_SYMBOL}${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }, []);

  const getModalTitle = () => {
    switch (activeModal) {
      case 'disclaimer': return 'Disclaimer';
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'banks': return 'Best US High-Yield APY Rates';
      default: return '';
    }
  };

  const getModalBody = () => {
    switch (activeModal) {
      case 'disclaimer': return LEGAL.DISCLAIMER;
      case 'privacy': return LEGAL.PRIVACY;
      case 'terms': return LEGAL.TERMS;
      default: return '';
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── HEADER / BRANDING ─────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandIconContainer}>
              <View style={styles.brandIconBar1} />
              <View style={styles.brandIconBar2} />
              <View style={styles.brandIconBar3} />
            </View>
            <Text style={styles.brandName}>{APP_TITLE}</Text>
          </View>
        </View>

        {/* ─── HERO SECTION ──────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.headline} selectable>{HERO_HEADER}</Text>
          <Text style={styles.subheadline}>{HERO_SUBHEADER}</Text>
        </View>

        {/* ─── DEPOSIT INPUT CARD ────────────────────────────────────── */}
        <View style={styles.depositCard}>
          <Text style={styles.depositLabel}>Your Cash Deposit</Text>
          <View style={styles.depositInputRow}>
            <Text style={styles.currencySymbol}>{CURRENCY_SYMBOL}</Text>
            <TextInput
              style={styles.depositInput}
              value={parseInt(deposit, 10).toLocaleString('en-US')}
              onChangeText={handleDepositChange}
              keyboardType="numeric"
              maxLength={12}
              selectTextOnFocus
              placeholderTextColor="#475569"
              accessibilityLabel="Deposit amount input"
            />
          </View>
        </View>

        {/* ─── DANGER CARD (RED / BLEED) ─────────────────────────────── */}
        <View style={styles.inflationCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconDanger}>
              <Text style={styles.cardIconText}>📉</Text>
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.inflationTitle}>{BLEED_TITLE}</Text>
              <Text style={styles.inflationSubtitle}>{BLEED_SUB}</Text>
            </View>
          </View>

          {/* Annual bleed ticker */}
          <View style={styles.annualBleedRow}>
            <Text style={styles.annualBleedLabel}>Annual Bleed</Text>
            <Text selectable style={styles.annualBleedValue}>
              -{formatCurrency(bleed)}
            </Text>
          </View>

          <View style={styles.inflationStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Monthly Loss</Text>
              <Text selectable style={styles.statValueDanger}>
                -{formatCurrency(bleed / 12, 2)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Daily Loss</Text>
              <Text selectable style={styles.statValueDanger}>
                -{CURRENCY_SYMBOL}{(bleed / 365).toFixed(2)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Lost since page load</Text>
              <Text selectable style={styles.liveTickerValue}>
                -{CURRENCY_SYMBOL}{liveLost.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── SUCCESS CARD (GREEN / OPTIMIZER) ──────────────────────── */}
        <View style={styles.yieldCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconSuccess}>
              <Text style={styles.cardIconText}>📈</Text>
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.yieldTitle}>{OPTIMIZER_TITLE}</Text>
              <Text style={styles.yieldSubtitle}>
                Up to {MAX_BENCHMARK_YIELD}% APY available
              </Text>
            </View>
          </View>

          {/* Optimized gain ticker */}
          <View style={styles.optimizedGainRow}>
            <Text style={styles.optimizedGainLabel}>Annual Gain Over Bank</Text>
            <Text selectable style={styles.optimizedGainValue}>
              +{formatCurrency(optimizedGain)}
            </Text>
          </View>

          {/* CTA Button */}
          <View style={styles.ctaContainer}>
            <Pressable
              style={styles.ctaButton}
              accessibilityRole="button"
              onPress={handleCtaPress}
            >
              <Text style={styles.ctaButtonText}>{CTA_TEXT}</Text>
            </Pressable>
          </View>
        </View>

        {/* ─── ADSENSE PLACEHOLDER ───────────────────────────────────── */}
        <View style={styles.adContainer}>
          <Text style={styles.adLabel}>Advertisement</Text>
          <View style={[styles.adBox, isDesktop && styles.adBoxDesktop]}>
            <Text style={styles.adPlaceholder}>
              {isDesktop ? '728×90 Ad Space' : '320×100 Ad Space'}
            </Text>
          </View>
        </View>

        {/* ─── LEGAL FOOTER ──────────────────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <View style={styles.footerLinks}>
            <Pressable
              onPress={() => setActiveModal('disclaimer')}
              style={styles.linkPressable}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Disclaimer</Text>
            </Pressable>
            <Text style={styles.footerSeparator}>•</Text>
            <Pressable
              onPress={() => setActiveModal('privacy')}
              style={styles.linkPressable}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Privacy Policy</Text>
            </Pressable>
            <Text style={styles.footerSeparator}>•</Text>
            <Pressable
              onPress={() => setActiveModal('terms')}
              style={styles.linkPressable}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Terms of Service</Text>
            </Pressable>
          </View>
          <Text selectable style={styles.copyright}>
            © 2025 Savvymax. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* ─── BANK COMPARISON MODAL ─────────────────────────────────── */}
      <Modal
        visible={activeModal === 'banks'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setActiveModal(null)}
        >
          <Pressable
            style={[styles.bankModalContent, isDesktop && styles.bankModalContentDesktop]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.bankModalHeader}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <Pressable
                onPress={() => setActiveModal(null)}
                style={styles.bankModalClose}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
              >
                <Text style={styles.bankModalCloseText}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.bankModalSubtitle}>
              Ranked by APY — updated May 2026
            </Text>
            <ScrollView
              style={styles.bankModalScroll}
              showsVerticalScrollIndicator={false}
            >
              {US_BANK_DATASET.map((bank, index) => (
                <View
                  key={bank.id}
                  style={[
                    styles.bankRow,
                    bank.isLowYield && styles.bankRowLowYield,
                    index === US_BANK_DATASET.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.bankRankCol}>
                    <Text style={[styles.bankRank, bank.isLowYield && styles.bankRankLow]}>
                      #{index + 1}
                    </Text>
                  </View>
                  <View style={styles.bankInfoCol}>
                    <Text style={[styles.bankName, bank.isLowYield && styles.bankNameLow]}>
                      {bank.name}
                    </Text>
                    {bank.note && (
                      <Text style={styles.bankNote}>{bank.note}</Text>
                    )}
                    {bank.isLowYield && (
                      <Text style={styles.bankLowYieldTag}>Low-Yield Trap</Text>
                    )}
                  </View>
                  <View style={styles.bankApyCol}>
                    <Text style={[styles.bankApy, bank.isLowYield && styles.bankApyLow]}>
                      {bank.apy.toFixed(2)}%
                    </Text>
                    <Text style={[styles.bankApyLabel, bank.isLowYield && styles.bankApyLabelLow]}>
                      APY
                    </Text>
                  </View>
                  <View style={styles.bankCtaCol}>
                    {bank.url && !bank.isLowYield ? (
                      <Pressable
                        style={styles.bankCtaBtn}
                        onPress={() => handleBankPress(bank.url!)}
                        accessibilityRole="link"
                      >
                        <Text style={styles.bankCtaBtnText}>Claim High Rate →</Text>
                      </Pressable>
                    ) : (
                      <View style={styles.bankCtaBtnDisabled}>
                        <Text style={styles.bankCtaBtnDisabledText}>—</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.bankModalFooter}>
              <Text style={styles.bankModalFooterText}>
                Rates verified May 2026. Always confirm current APY with provider before depositing.
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ─── LEGAL MODAL OVERLAY ───────────────────────────────────── */}
      <Modal
        visible={activeModal !== null && activeModal !== 'banks'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setActiveModal(null)}
        >
          <Pressable
            style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>{getModalTitle()}</Text>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text selectable style={styles.modalBody}>{getModalBody()}</Text>
            </ScrollView>
            <Pressable
              style={styles.closeBtn}
              onPress={() => setActiveModal(null)}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0E17',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 20,
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },

  // Header
  header: {
    gap: 10,
    paddingTop: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconContainer: {
    width: 28,
    height: 28,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
  },
  brandIconBar1: {
    width: 5,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#34D399',
    opacity: 0.6,
  },
  brandIconBar2: {
    width: 5,
    height: 17,
    borderRadius: 2,
    backgroundColor: '#34D399',
    opacity: 0.8,
  },
  brandIconBar3: {
    width: 5,
    height: 24,
    borderRadius: 2,
    backgroundColor: '#34D399',
  },
  brandName: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: '#F3F4F6',
    letterSpacing: -0.5,
  },

  // Hero
  heroSection: {
    gap: 8,
  },
  headline: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: '#F3F4F6',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 22,
  },

  // Deposit Card
  depositCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 22,
    gap: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  depositLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: '#94A3B8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  depositInputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currencySymbol: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: '#F3F4F6',
    fontVariant: ['tabular-nums'],
  },
  depositInput: {
    flex: 1,
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: '#F3F4F6',
    fontVariant: ['tabular-nums'],
    padding: 0,
    margin: 0,
  },

  // Inflation / Bleed Card (Red / Danger)
  inflationCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F87171',
    borderWidth: 1,
    borderColor: '#1F2937',
    boxShadow: '0 4px 20px rgba(248, 113, 113, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconDanger: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconSuccess: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: {
    fontSize: 18,
  },
  cardHeaderText: {
    flex: 1,
    gap: 2,
  },
  inflationTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: '#F3F4F6',
  },
  inflationSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#F87171',
  },
  annualBleedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  annualBleedLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#94A3B8',
  },
  annualBleedValue: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: '#F87171',
    fontVariant: ['tabular-nums'],
  },
  inflationStats: {
    backgroundColor: 'rgba(248, 113, 113, 0.06)',
    borderRadius: 12,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#94A3B8',
  },
  statValueDanger: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#F87171',
    fontVariant: ['tabular-nums'],
  },
  statDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  liveTickerValue: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#F87171',
    fontVariant: ['tabular-nums'],
  },

  // Yield Card (Green / Success)
  yieldCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34D399',
    borderWidth: 1,
    borderColor: '#1F2937',
    boxShadow: '0 4px 20px rgba(52, 211, 153, 0.08)',
  },
  yieldTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: '#F3F4F6',
  },
  yieldSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#34D399',
  },
  optimizedGainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optimizedGainLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#94A3B8',
  },
  optimizedGainValue: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: '#34D399',
    fontVariant: ['tabular-nums'],
  },
  ctaContainer: {
    paddingTop: 4,
  },
  ctaButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  ctaButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#0A0E17',
    letterSpacing: 0.3,
  },

  // AdSense Placeholder
  adContainer: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  adLabel: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: '#475569',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  adBox: {
    width: 320,
    height: 100,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#1F2937',
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adBoxDesktop: {
    width: 728,
    height: 90,
  },
  adPlaceholder: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#475569',
    letterSpacing: 0.3,
  },

  // Footer
  footer: {
    gap: 14,
    paddingTop: 8,
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#1F2937',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  linkPressable: {
    minHeight: 44,
    justifyContent: 'center',
  },
  link: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'underline',
  },
  footerSeparator: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#475569',
  },
  copyright: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Modal Overlay (shared)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#111827',
    borderRadius: 20,
    borderCurve: 'continuous',
    padding: 24,
    maxWidth: 500,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#1F2937',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
  },
  modalContentDesktop: {
    maxWidth: 560,
    padding: 32,
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: '#F3F4F6',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalBody: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 22,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
  },
  closeBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: '#34D399',
  },

  // Bank Comparison Modal
  bankModalContent: {
    backgroundColor: '#0F1629',
    borderRadius: 20,
    borderCurve: 'continuous',
    padding: 20,
    maxWidth: 580,
    width: '100%',
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#1F2937',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
  },
  bankModalContentDesktop: {
    maxWidth: 640,
    padding: 28,
  },
  bankModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bankModalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankModalCloseText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  bankModalSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  bankModalScroll: {
    maxHeight: 500,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 41, 55, 0.6)',
    gap: 10,
  },
  bankRowLowYield: {
    opacity: 0.55,
    backgroundColor: 'rgba(248, 113, 113, 0.04)',
    borderRadius: 10,
  },
  bankRankCol: {
    width: 32,
    alignItems: 'center',
  },
  bankRank: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#64748B',
  },
  bankRankLow: {
    color: '#475569',
  },
  bankInfoCol: {
    flex: 1,
    gap: 2,
  },
  bankName: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: '#F3F4F6',
  },
  bankNameLow: {
    color: '#64748B',
  },
  bankNote: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  bankLowYieldTag: {
    fontFamily: Fonts.semiBold,
    fontSize: 10,
    color: '#F87171',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  bankApyCol: {
    alignItems: 'flex-end',
    gap: 1,
    minWidth: 52,
  },
  bankApy: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#34D399',
    fontVariant: ['tabular-nums'],
  },
  bankApyLow: {
    color: '#64748B',
  },
  bankApyLabel: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#34D399',
    opacity: 0.7,
  },
  bankApyLabelLow: {
    color: '#64748B',
  },
  bankCtaCol: {
    minWidth: 120,
    alignItems: 'flex-end',
  },
  bankCtaBtn: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    minHeight: 36,
    justifyContent: 'center',
  },
  bankCtaBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: '#34D399',
    letterSpacing: 0.2,
  },
  bankCtaBtnDisabled: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankCtaBtnDisabledText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#475569',
  },
  bankModalFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 41, 55, 0.6)',
  },
  bankModalFooterText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 16,
  },
});

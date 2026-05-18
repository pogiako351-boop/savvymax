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
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/Typography';

// ─── MULTI-COUNTRY REGISTRY ────────────────────────────────────────────────────

interface RegionEntry {
  REGION_CODE: string;
  CURRENCY_SYMBOL: string;
  COUNTRY_NAME: string;
  CURRENT_INFLATION_RATE: number;
  TRADITIONAL_BANK_APY: number;
  MAX_BENCHMARK_YIELD: number;
  AFFILIATE_URL: string;
  UI: {
    APP_TITLE: string;
    HERO_HEADER: string;
    HERO_SUBHEADER: string;
    BLEED_TITLE: string;
    BLEED_SUB: string;
    OPTIMIZER_TITLE: string;
    CTA: string;
  };
  LEGAL: {
    DISCLAIMER: string;
    PRIVACY: string;
    TERMS: string;
  };
}

const MULTI_COUNTRY_REGISTRY: Record<string, RegionEntry> = {
  US: {
    REGION_CODE: 'US',
    CURRENCY_SYMBOL: '$',
    COUNTRY_NAME: 'United States',
    CURRENT_INFLATION_RATE: 3.2,
    TRADITIONAL_BANK_APY: 0.01,
    MAX_BENCHMARK_YIELD: 5.05,
    AFFILIATE_URL: 'https://savvymax.goldsphere.org/us-deals',
    UI: {
      APP_TITLE: 'Savvymax',
      HERO_HEADER: 'Stop Losing Money to Inflation',
      HERO_SUBHEADER: 'Your savings are bleeding purchasing power every second. See exactly how much — and how to fix it.',
      BLEED_TITLE: 'Inflation Bleed',
      BLEED_SUB: 'Your cash is losing value after bank interest',
      OPTIMIZER_TITLE: 'Optimized Yield Potential',
      CTA: 'Find Best APY Rates',
    },
    LEGAL: {
      DISCLAIMER: 'Savvymax is an independent, advertising-supported comparison tool for US residents. APY rates shown are subject to change based on Federal Reserve policy, bank pricing, and market conditions. This is not financial advice. Verify rates directly with institutions before depositing. FDIC insurance applies up to $250,000 per depositor, per institution.',
      PRIVACY: 'We do not collect personal financial data. Anonymous usage analytics (page views, region selection, deposit range) are collected via privacy-respecting analytics. No data is sold to third parties. AdSense may use cookies for ad personalization — you can opt out via Google Ad Settings.',
      TERMS: 'By using Savvymax, you acknowledge this tool is for informational purposes only. We are not a bank, broker, or financial advisor. Affiliate links may earn us a commission at no cost to you. All trademarks belong to their respective owners.',
    },
  },
  UK: {
    REGION_CODE: 'UK',
    CURRENCY_SYMBOL: '£',
    COUNTRY_NAME: 'United Kingdom',
    CURRENT_INFLATION_RATE: 4.0,
    TRADITIONAL_BANK_APY: 0.1,
    MAX_BENCHMARK_YIELD: 5.22,
    AFFILIATE_URL: 'https://savvymax.goldsphere.org/uk-deals',
    UI: {
      APP_TITLE: 'Savvymax',
      HERO_HEADER: 'Your Savings Are Losing Value',
      HERO_SUBHEADER: 'UK inflation is eroding your cash. See the real cost — and the best savings rates to fight back.',
      BLEED_TITLE: 'Inflation Erosion',
      BLEED_SUB: 'Net loss after traditional bank interest',
      OPTIMIZER_TITLE: 'Best ISA / Savings Rate',
      CTA: 'Compare UK Savings Rates',
    },
    LEGAL: {
      DISCLAIMER: 'Savvymax UK is an independent comparison service. AER/gross rates shown are indicative and subject to change. This is not regulated financial advice under the FCA. Verify rates directly with providers. FSCS protection covers up to £85,000 per eligible person, per institution.',
      PRIVACY: 'We comply with UK GDPR and the Data Protection Act 2018. No personal financial data is collected or stored. Anonymous analytics help improve the service. You may request data deletion at any time.',
      TERMS: 'This tool is for informational purposes only. We are not authorised or regulated by the FCA. Affiliate commissions may be earned from featured providers. All trademarks are property of their respective owners.',
    },
  },
  SG: {
    REGION_CODE: 'SG',
    CURRENCY_SYMBOL: 'S$',
    COUNTRY_NAME: 'Singapore',
    CURRENT_INFLATION_RATE: 3.7,
    TRADITIONAL_BANK_APY: 0.05,
    MAX_BENCHMARK_YIELD: 3.88,
    AFFILIATE_URL: 'https://savvymax.goldsphere.org/sg-deals',
    UI: {
      APP_TITLE: 'Savvymax',
      HERO_HEADER: 'Your Cash Is Losing Purchasing Power',
      HERO_SUBHEADER: 'Singapore inflation silently eats your savings. See the real damage and how to earn more.',
      BLEED_TITLE: 'Inflation Loss',
      BLEED_SUB: 'Net purchasing power loss after bank interest',
      OPTIMIZER_TITLE: 'Best Fixed Deposit / Savings Rate',
      CTA: 'Compare SG Savings Rates',
    },
    LEGAL: {
      DISCLAIMER: 'Savvymax SG is an independent comparison tool. Interest rates shown are indicative and subject to change. This is not licensed financial advice under MAS regulations. Verify rates with respective banks. SDIC insures up to S$100,000 per depositor, per institution.',
      PRIVACY: 'We comply with the Personal Data Protection Act (PDPA). No personal financial information is collected. Anonymous analytics are used to improve the service.',
      TERMS: 'This tool provides general information only. We are not a licensed financial adviser in Singapore. Affiliate relationships may exist with featured institutions.',
    },
  },
  AU: {
    REGION_CODE: 'AU',
    CURRENCY_SYMBOL: 'A$',
    COUNTRY_NAME: 'Australia',
    CURRENT_INFLATION_RATE: 3.6,
    TRADITIONAL_BANK_APY: 0.01,
    MAX_BENCHMARK_YIELD: 5.50,
    AFFILIATE_URL: 'https://savvymax.goldsphere.org/au-deals',
    UI: {
      APP_TITLE: 'Savvymax',
      HERO_HEADER: 'Inflation Is Eating Your Savings',
      HERO_SUBHEADER: 'Australian inflation erodes purchasing power daily. See what you\'re really losing — and the best rates available.',
      BLEED_TITLE: 'Inflation Drain',
      BLEED_SUB: 'Net loss after traditional bank earnings',
      OPTIMIZER_TITLE: 'Best HISA Rate',
      CTA: 'Compare AU Savings Rates',
    },
    LEGAL: {
      DISCLAIMER: 'Savvymax AU is an independent comparison service. Rates shown are indicative and may change without notice. This is general information only — not personal financial advice. Verify rates directly with ADIs. Government guarantee covers up to A$250,000 per account holder, per ADI.',
      PRIVACY: 'We comply with the Australian Privacy Act 1988 and APPs. No personal financial data is collected or stored. Anonymous analytics are used for service improvement.',
      TERMS: 'This tool provides general information only and does not constitute financial product advice. We hold no AFSL. Affiliate commissions may be received. All trademarks belong to their respective owners.',
    },
  },
  CA: {
    REGION_CODE: 'CA',
    CURRENCY_SYMBOL: 'C$',
    COUNTRY_NAME: 'Canada',
    CURRENT_INFLATION_RATE: 2.9,
    TRADITIONAL_BANK_APY: 0.01,
    MAX_BENCHMARK_YIELD: 4.50,
    AFFILIATE_URL: 'https://savvymax.goldsphere.org/ca-deals',
    UI: {
      APP_TITLE: 'Savvymax',
      HERO_HEADER: 'Your Savings Are Shrinking',
      HERO_SUBHEADER: 'Canadian inflation is quietly reducing your purchasing power. See the numbers and find better rates.',
      BLEED_TITLE: 'Inflation Impact',
      BLEED_SUB: 'Net erosion after bank interest earnings',
      OPTIMIZER_TITLE: 'Best HISA / GIC Rate',
      CTA: 'Compare Canadian Rates',
    },
    LEGAL: {
      DISCLAIMER: 'Savvymax CA is an independent comparison tool. Rates shown are subject to change. This does not constitute financial advice. Verify rates directly with institutions. CDIC insures eligible deposits up to C$100,000 per category.',
      PRIVACY: 'We comply with PIPEDA and applicable provincial privacy legislation. No personal financial data is collected. Anonymous usage data helps improve the service.',
      TERMS: 'This tool is for informational purposes only. We are not a registered dealer or adviser. Affiliate relationships may exist with listed institutions. All trademarks are property of their respective owners.',
    },
  },
  UAE: {
    REGION_CODE: 'UAE',
    CURRENCY_SYMBOL: 'د.إ',
    COUNTRY_NAME: 'United Arab Emirates',
    CURRENT_INFLATION_RATE: 2.3,
    TRADITIONAL_BANK_APY: 0.01,
    MAX_BENCHMARK_YIELD: 4.75,
    AFFILIATE_URL: 'https://savvymax.goldsphere.org/uae-deals',
    UI: {
      APP_TITLE: 'Savvymax',
      HERO_HEADER: 'Maximize Your Savings Returns',
      HERO_SUBHEADER: 'Even low UAE inflation erodes idle cash. Discover the best deposit rates available to you.',
      BLEED_TITLE: 'Inflation Cost',
      BLEED_SUB: 'Net loss after traditional deposit interest',
      OPTIMIZER_TITLE: 'Best Fixed Deposit Rate',
      CTA: 'Compare UAE Deposit Rates',
    },
    LEGAL: {
      DISCLAIMER: 'Savvymax UAE is an independent comparison tool. Rates shown are indicative and subject to change. This is not financial advice regulated by the CBUAE or SCA. Verify rates directly with banks.',
      PRIVACY: 'We respect your privacy in accordance with UAE Federal Decree-Law No. 45 of 2021 on Data Protection. No personal financial data is collected.',
      TERMS: 'This tool provides general information only. We are not licensed by the CBUAE. Affiliate commissions may apply. All trademarks belong to their respective owners.',
    },
  },
  NZ: {
    REGION_CODE: 'NZ',
    CURRENCY_SYMBOL: 'NZ$',
    COUNTRY_NAME: 'New Zealand',
    CURRENT_INFLATION_RATE: 4.7,
    TRADITIONAL_BANK_APY: 0.05,
    MAX_BENCHMARK_YIELD: 5.80,
    AFFILIATE_URL: 'https://savvymax.goldsphere.org/nz-deals',
    UI: {
      APP_TITLE: 'Savvymax',
      HERO_HEADER: 'Inflation Is Stealing Your Savings',
      HERO_SUBHEADER: 'NZ inflation is among the highest in the OECD. See exactly what you\'re losing and how to earn more.',
      BLEED_TITLE: 'Inflation Loss',
      BLEED_SUB: 'Net purchasing power drain after bank interest',
      OPTIMIZER_TITLE: 'Best Term Deposit Rate',
      CTA: 'Compare NZ Savings Rates',
    },
    LEGAL: {
      DISCLAIMER: 'Savvymax NZ is an independent comparison tool. Rates shown are indicative and may change. This is not personalised financial advice under the Financial Markets Conduct Act 2013. Verify rates directly with providers.',
      PRIVACY: 'We comply with the NZ Privacy Act 2020. No personal financial data is collected or stored. Anonymous analytics help improve the service.',
      TERMS: 'This tool provides general information only. We are not a licensed Financial Advice Provider. Affiliate commissions may apply. All trademarks belong to their respective owners.',
    },
  },
  IE: {
    REGION_CODE: 'IE',
    CURRENCY_SYMBOL: '€',
    COUNTRY_NAME: 'Ireland',
    CURRENT_INFLATION_RATE: 2.0,
    TRADITIONAL_BANK_APY: 0.01,
    MAX_BENCHMARK_YIELD: 3.50,
    AFFILIATE_URL: 'https://savvymax.goldsphere.org/ie-deals',
    UI: {
      APP_TITLE: 'Savvymax',
      HERO_HEADER: 'Your Euro Savings Are Losing Value',
      HERO_SUBHEADER: 'Even moderate inflation erodes idle cash. See the cost and find the best deposit rates in Ireland.',
      BLEED_TITLE: 'Inflation Erosion',
      BLEED_SUB: 'Net loss after traditional bank earnings',
      OPTIMIZER_TITLE: 'Best Deposit Rate',
      CTA: 'Compare Irish Savings Rates',
    },
    LEGAL: {
      DISCLAIMER: 'Savvymax IE is an independent comparison tool. Rates shown are indicative and subject to change. This is not regulated financial advice under the Central Bank of Ireland. Verify rates directly with providers. Deposit Guarantee Scheme covers up to €100,000 per depositor, per institution.',
      PRIVACY: 'We comply with EU GDPR. No personal financial data is collected or stored. Anonymous analytics are used for service improvement. You have the right to request data deletion.',
      TERMS: 'This tool provides general information only. We are not regulated by the Central Bank of Ireland. Affiliate commissions may be received. All trademarks are property of their respective owners.',
    },
  },
};

const REGION_CODES = Object.keys(MULTI_COUNTRY_REGISTRY);

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function ProductionSavvymax() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 728;

  // State
  const [currentRegion, setCurrentRegion] = useState<string>('US');
  const [deposit, setDeposit] = useState('10000');
  const [bleed, setBleed] = useState(0);
  const [optimizedGain, setOptimizedGain] = useState(0);
  const [liveLost, setLiveLost] = useState(0);
  const [activeModal, setActiveModal] = useState<'disclaimer' | 'privacy' | 'terms' | null>(null);

  const regionConfig = MULTI_COUNTRY_REGISTRY[currentRegion];
  const depositAmount = Math.max(0, parseInt(deposit.replace(/[^0-9]/g, ''), 10) || 0);

  // ─── useEffect: Recalculate bleed & optimizedGain on deposit/region change
  useEffect(() => {
    const amount = depositAmount;
    const config = MULTI_COUNTRY_REGISTRY[currentRegion];

    const inflationLoss = (amount * config.CURRENT_INFLATION_RATE) / 100;
    const traditionalBankEarnings = (amount * config.TRADITIONAL_BANK_APY) / 100;
    const maxBenchmarkEarnings = (amount * config.MAX_BENCHMARK_YIELD) / 100;

    const newBleed = inflationLoss - traditionalBankEarnings;
    const newOptimizedGain = maxBenchmarkEarnings - traditionalBankEarnings;

    setBleed(newBleed);
    setOptimizedGain(newOptimizedGain);
    setLiveLost(0);
  }, [depositAmount, currentRegion]);

  // ─── useEffect 3: Interval ticker — increment liveLost every 100ms ───────
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

  // ─── Region selection handler (state-driven only) ────────────────────────
  const handleRegionSelection = useCallback((code: string) => {
    setCurrentRegion(code);
  }, []);

  // ─── Deposit input handler ───────────────────────────────────────────────
  const handleDepositChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10) || 0;
    const clamped = Math.min(num, 10000000);
    setDeposit(clamped.toString());
  }, []);

  // ─── CTA handler (sandbox-aware) ────────────────────────────────────────
  const handleCtaPress = useCallback(() => {
    const url = regionConfig.AFFILIATE_URL;
    try {
      if (typeof window !== 'undefined') {
        const isSandbox = window.self !== window.top;
        if (isSandbox) {
          if (Platform.OS === 'web') {
            window.alert(`${regionConfig.COUNTRY_NAME}: ${url}`);
          } else {
            Alert.alert(regionConfig.COUNTRY_NAME, url);
          }
        } else {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
    } catch {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.alert(`${regionConfig.COUNTRY_NAME}: ${url}`);
      } else {
        Alert.alert(regionConfig.COUNTRY_NAME, url);
      }
    }
  }, [regionConfig]);

  // ─── Format helpers ──────────────────────────────────────────────────────
  const formatCurrency = useCallback((amount: number, decimals = 2) => {
    return `${regionConfig.CURRENCY_SYMBOL}${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }, [regionConfig.CURRENCY_SYMBOL]);

  const getModalTitle = () => {
    switch (activeModal) {
      case 'disclaimer': return 'Disclaimer';
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      default: return '';
    }
  };

  const getModalBody = () => {
    switch (activeModal) {
      case 'disclaimer': return regionConfig.LEGAL.DISCLAIMER;
      case 'privacy': return regionConfig.LEGAL.PRIVACY;
      case 'terms': return regionConfig.LEGAL.TERMS;
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
        {/* ─── REGION SELECTOR NAV BAR ───────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={styles.regionNavContent}
        >
          {REGION_CODES.map((code) => {
            const isActive = code === currentRegion;
            return (
              <Pressable
                key={code}
                onPress={() => handleRegionSelection(code)}
                style={[
                  styles.regionChip,
                  isActive && styles.regionChipActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Select ${MULTI_COUNTRY_REGISTRY[code].COUNTRY_NAME}`}
              >
                <Text
                  style={[
                    styles.regionChipText,
                    isActive && styles.regionChipTextActive,
                  ]}
                >
                  {code}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ─── HEADER / BRANDING ─────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandName}>{regionConfig.UI.APP_TITLE}</Text>
            <View style={styles.regionBadge}>
              <Text style={styles.regionBadgeText}>
                {regionConfig.COUNTRY_NAME}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── HERO SECTION ──────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.headline} selectable>{regionConfig.UI.HERO_HEADER}</Text>
          <Text style={styles.subheadline}>{regionConfig.UI.HERO_SUBHEADER}</Text>
        </View>

        {/* ─── DEPOSIT INPUT CARD ────────────────────────────────────── */}
        <View style={styles.depositCard}>
          <Text style={styles.depositLabel}>Your Cash Deposit</Text>
          <View style={styles.depositInputRow}>
            <Text style={styles.currencySymbol}>
              {regionConfig.CURRENCY_SYMBOL}
            </Text>
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
              <Text style={styles.inflationTitle}>
                {regionConfig.UI.BLEED_TITLE}
              </Text>
              <Text style={styles.inflationSubtitle}>
                {regionConfig.UI.BLEED_SUB}
              </Text>
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
                -{regionConfig.CURRENCY_SYMBOL}{(bleed / 365).toFixed(2)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Lost since page load</Text>
              <Text selectable style={styles.liveTickerValue}>
                -{regionConfig.CURRENCY_SYMBOL}{liveLost.toFixed(6)}
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
              <Text style={styles.yieldTitle}>
                {regionConfig.UI.OPTIMIZER_TITLE}
              </Text>
              <Text style={styles.yieldSubtitle}>
                Up to {regionConfig.MAX_BENCHMARK_YIELD}% APY available
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
              <Text style={styles.ctaButtonText}>
                {regionConfig.UI.CTA}
              </Text>
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
            © 2025 Savvymax. All rights reserved. {regionConfig.COUNTRY_NAME}
          </Text>
        </View>
      </ScrollView>

      {/* ─── LEGAL MODAL OVERLAY ───────────────────────────────────── */}
      <Modal
        visible={activeModal !== null}
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

// ─── STYLES ────────────────────────────────────────────────────────────────────

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

  // Region Nav
  regionNavContent: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  regionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
    minWidth: 44,
    minHeight: 44,
  },
  regionChipActive: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderColor: '#34D399',
  },
  regionChipText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  regionChipTextActive: {
    color: '#34D399',
  },

  // Header
  header: {
    gap: 10,
    paddingTop: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34D399',
  },
  brandName: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: '#F3F4F6',
    letterSpacing: -0.3,
  },
  regionBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  regionBadgeText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#34D399',
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

  // Modal Overlay
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
});

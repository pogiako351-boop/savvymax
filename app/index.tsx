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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/Typography';

// ─── MULTI-COUNTRY REGISTRY ────────────────────────────────────────────────────

interface RegionConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  inflationRate: number;
  apyBenchmark: number;
  optimizedApy: number;
  affiliateUrl: string;
  uiCopy: {
    headline: string;
    subheadline: string;
    depositLabel: string;
    inflationCardTitle: string;
    yieldCardTitle: string;
    ctaButton: string;
  };
  legal: {
    disclaimer: string;
    privacy: string;
    terms: string;
  };
}

const MULTI_COUNTRY_REGISTRY: Record<string, RegionConfig> = {
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    inflationRate: 3.2,
    apyBenchmark: 0.01,
    optimizedApy: 5.05,
    affiliateUrl: 'https://savvymax.goldsphere.org/us-deals',
    uiCopy: {
      headline: 'Stop Losing Money to Inflation',
      subheadline: 'Your savings are bleeding purchasing power every second. See exactly how much — and how to fix it.',
      depositLabel: 'Your Cash Deposit',
      inflationCardTitle: 'Inflation Bleed',
      yieldCardTitle: 'Optimized Yield',
      ctaButton: 'Find Best APY Rates',
    },
    legal: {
      disclaimer: 'Savvymax is an independent, advertising-supported comparison tool for US residents. APY rates shown are subject to change based on Federal Reserve policy, bank pricing, and market conditions. This is not financial advice. Verify rates directly with institutions before depositing. FDIC insurance applies up to $250,000 per depositor, per institution.',
      privacy: 'We do not collect personal financial data. Anonymous usage analytics (page views, region selection, deposit range) are collected via privacy-respecting analytics. No data is sold to third parties. AdSense may use cookies for ad personalization — you can opt out via Google Ad Settings.',
      terms: 'By using Savvymax, you acknowledge this tool is for informational purposes only. We are not a bank, broker, or financial advisor. Affiliate links may earn us a commission at no cost to you. All trademarks belong to their respective owners.',
    },
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    inflationRate: 4.0,
    apyBenchmark: 0.1,
    optimizedApy: 5.22,
    affiliateUrl: 'https://savvymax.goldsphere.org/uk-deals',
    uiCopy: {
      headline: 'Your Savings Are Losing Value',
      subheadline: 'UK inflation is eroding your cash. See the real cost — and the best savings rates to fight back.',
      depositLabel: 'Your Cash Savings',
      inflationCardTitle: 'Inflation Erosion',
      yieldCardTitle: 'Best ISA / Savings Rate',
      ctaButton: 'Compare UK Savings Rates',
    },
    legal: {
      disclaimer: 'Savvymax UK is an independent comparison service. AER/gross rates shown are indicative and subject to change. This is not regulated financial advice under the FCA. Verify rates directly with providers. FSCS protection covers up to £85,000 per eligible person, per institution.',
      privacy: 'We comply with UK GDPR and the Data Protection Act 2018. No personal financial data is collected or stored. Anonymous analytics help improve the service. You may request data deletion at any time.',
      terms: 'This tool is for informational purposes only. We are not authorised or regulated by the FCA. Affiliate commissions may be earned from featured providers. All trademarks are property of their respective owners.',
    },
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    inflationRate: 3.7,
    apyBenchmark: 0.05,
    optimizedApy: 3.88,
    affiliateUrl: 'https://savvymax.goldsphere.org/sg-deals',
    uiCopy: {
      headline: 'Your Cash Is Losing Purchasing Power',
      subheadline: 'Singapore inflation silently eats your savings. See the real damage and how to earn more.',
      depositLabel: 'Your Deposit Amount',
      inflationCardTitle: 'Inflation Loss',
      yieldCardTitle: 'Best Fixed Deposit / Savings Rate',
      ctaButton: 'Compare SG Savings Rates',
    },
    legal: {
      disclaimer: 'Savvymax SG is an independent comparison tool. Interest rates shown are indicative and subject to change. This is not licensed financial advice under MAS regulations. Verify rates with respective banks. SDIC insures up to S$100,000 per depositor, per institution.',
      privacy: 'We comply with the Personal Data Protection Act (PDPA). No personal financial information is collected. Anonymous analytics are used to improve the service.',
      terms: 'This tool provides general information only. We are not a licensed financial adviser in Singapore. Affiliate relationships may exist with featured institutions.',
    },
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    inflationRate: 3.6,
    apyBenchmark: 0.01,
    optimizedApy: 5.50,
    affiliateUrl: 'https://savvymax.goldsphere.org/au-deals',
    uiCopy: {
      headline: 'Inflation Is Eating Your Savings',
      subheadline: 'Australian inflation erodes purchasing power daily. See what you\'re really losing — and the best rates available.',
      depositLabel: 'Your Savings Balance',
      inflationCardTitle: 'Inflation Drain',
      yieldCardTitle: 'Best HISA Rate',
      ctaButton: 'Compare AU Savings Rates',
    },
    legal: {
      disclaimer: 'Savvymax AU is an independent comparison service. Rates shown are indicative and may change without notice. This is general information only — not personal financial advice. Verify rates directly with ADIs. Government guarantee covers up to A$250,000 per account holder, per ADI.',
      privacy: 'We comply with the Australian Privacy Act 1988 and APPs. No personal financial data is collected or stored. Anonymous analytics are used for service improvement.',
      terms: 'This tool provides general information only and does not constitute financial product advice. We hold no AFSL. Affiliate commissions may be received. All trademarks belong to their respective owners.',
    },
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    inflationRate: 2.9,
    apyBenchmark: 0.01,
    optimizedApy: 4.50,
    affiliateUrl: 'https://savvymax.goldsphere.org/ca-deals',
    uiCopy: {
      headline: 'Your Savings Are Shrinking',
      subheadline: 'Canadian inflation is quietly reducing your purchasing power. See the numbers and find better rates.',
      depositLabel: 'Your Deposit',
      inflationCardTitle: 'Inflation Impact',
      yieldCardTitle: 'Best HISA / GIC Rate',
      ctaButton: 'Compare Canadian Rates',
    },
    legal: {
      disclaimer: 'Savvymax CA is an independent comparison tool. Rates shown are subject to change. This does not constitute financial advice. Verify rates directly with institutions. CDIC insures eligible deposits up to C$100,000 per category.',
      privacy: 'We comply with PIPEDA and applicable provincial privacy legislation. No personal financial data is collected. Anonymous usage data helps improve the service.',
      terms: 'This tool is for informational purposes only. We are not a registered dealer or adviser. Affiliate relationships may exist with listed institutions. All trademarks are property of their respective owners.',
    },
  },
  UAE: {
    code: 'UAE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'د.إ',
    inflationRate: 2.3,
    apyBenchmark: 0.01,
    optimizedApy: 4.75,
    affiliateUrl: 'https://savvymax.goldsphere.org/uae-deals',
    uiCopy: {
      headline: 'Maximize Your Savings Returns',
      subheadline: 'Even low UAE inflation erodes idle cash. Discover the best deposit rates available to you.',
      depositLabel: 'Your Deposit Amount',
      inflationCardTitle: 'Inflation Cost',
      yieldCardTitle: 'Best Fixed Deposit Rate',
      ctaButton: 'Compare UAE Deposit Rates',
    },
    legal: {
      disclaimer: 'Savvymax UAE is an independent comparison tool. Rates shown are indicative and subject to change. This is not financial advice regulated by the CBUAE or SCA. Verify rates directly with banks.',
      privacy: 'We respect your privacy in accordance with UAE Federal Decree-Law No. 45 of 2021 on Data Protection. No personal financial data is collected.',
      terms: 'This tool provides general information only. We are not licensed by the CBUAE. Affiliate commissions may apply. All trademarks belong to their respective owners.',
    },
  },
  NZ: {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    currency: 'NZD',
    currencySymbol: 'NZ$',
    inflationRate: 4.7,
    apyBenchmark: 0.05,
    optimizedApy: 5.80,
    affiliateUrl: 'https://savvymax.goldsphere.org/nz-deals',
    uiCopy: {
      headline: 'Inflation Is Stealing Your Savings',
      subheadline: 'NZ inflation is among the highest in the OECD. See exactly what you\'re losing and how to earn more.',
      depositLabel: 'Your Savings Amount',
      inflationCardTitle: 'Inflation Loss',
      yieldCardTitle: 'Best Term Deposit Rate',
      ctaButton: 'Compare NZ Savings Rates',
    },
    legal: {
      disclaimer: 'Savvymax NZ is an independent comparison tool. Rates shown are indicative and may change. This is not personalised financial advice under the Financial Markets Conduct Act 2013. Verify rates directly with providers.',
      privacy: 'We comply with the NZ Privacy Act 2020. No personal financial data is collected or stored. Anonymous analytics help improve the service.',
      terms: 'This tool provides general information only. We are not a licensed Financial Advice Provider. Affiliate commissions may apply. All trademarks belong to their respective owners.',
    },
  },
  IE: {
    code: 'IE',
    name: 'Ireland',
    flag: '🇮🇪',
    currency: 'EUR',
    currencySymbol: '€',
    inflationRate: 2.0,
    apyBenchmark: 0.01,
    optimizedApy: 3.50,
    affiliateUrl: 'https://savvymax.goldsphere.org/ie-deals',
    uiCopy: {
      headline: 'Your Euro Savings Are Losing Value',
      subheadline: 'Even moderate inflation erodes idle cash. See the cost and find the best deposit rates in Ireland.',
      depositLabel: 'Your Deposit',
      inflationCardTitle: 'Inflation Erosion',
      yieldCardTitle: 'Best Deposit Rate',
      ctaButton: 'Compare Irish Savings Rates',
    },
    legal: {
      disclaimer: 'Savvymax IE is an independent comparison tool. Rates shown are indicative and subject to change. This is not regulated financial advice under the Central Bank of Ireland. Verify rates directly with providers. Deposit Guarantee Scheme covers up to €100,000 per depositor, per institution.',
      privacy: 'We comply with EU GDPR. No personal financial data is collected or stored. Anonymous analytics are used for service improvement. You have the right to request data deletion.',
      terms: 'This tool provides general information only. We are not regulated by the Central Bank of Ireland. Affiliate commissions may be received. All trademarks are property of their respective owners.',
    },
  },
};

const REGION_CODES = Object.keys(MULTI_COUNTRY_REGISTRY);

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function UnifiedSavvymax() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 728;

  const [selectedRegion, setSelectedRegion] = useState<string>('US');
  const [depositInput, setDepositInput] = useState('10000');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'disclaimer' | 'privacy' | 'terms'>('disclaimer');

  const regionConfig = MULTI_COUNTRY_REGISTRY[selectedRegion];
  const depositAmount = Math.max(0, parseInt(depositInput.replace(/[^0-9]/g, ''), 10) || 0);

  // Auto-detect region from URL path on web
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location) {
      const path = window.location.pathname.replace('/', '').toUpperCase();
      if (REGION_CODES.includes(path)) {
        setSelectedRegion(path);
      }
    }
  }, []);

  // Inflation calculations
  const annualInflationLoss = (depositAmount * regionConfig.inflationRate) / 100;
  const monthlyInflationLoss = annualInflationLoss / 12;
  const dailyInflationLoss = annualInflationLoss / 365;

  // Optimized yield calculations
  const annualYield = (depositAmount * regionConfig.optimizedApy) / 100;
  const monthlyYield = annualYield / 12;
  const netGain = annualYield - annualInflationLoss;

  // Live ticker
  const [tickerLoss, setTickerLoss] = useState(0);
  const startTimeRef = useRef(Date.now());
  const perSecondLoss = annualInflationLoss / (365 * 24 * 60 * 60);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setTickerLoss(0);
  }, [depositAmount, selectedRegion]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTickerLoss(elapsed * perSecondLoss);
    }, 100);
    return () => clearInterval(interval);
  }, [perSecondLoss]);

  const formatCurrency = useCallback((amount: number, decimals = 2) => {
    return `${regionConfig.currencySymbol}${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }, [regionConfig.currencySymbol]);

  const handleDepositChange = useCallback((text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10) || 0;
    const clamped = Math.min(num, 10000000);
    setDepositInput(clamped.toString());
  }, []);

  const openModal = useCallback((type: 'disclaimer' | 'privacy' | 'terms') => {
    setModalType(type);
    setModalVisible(true);
  }, []);

  const getModalTitle = () => {
    switch (modalType) {
      case 'disclaimer': return 'Disclaimer';
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
    }
  };

  const getModalBody = () => {
    switch (modalType) {
      case 'disclaimer': return regionConfig.legal.disclaimer;
      case 'privacy': return regionConfig.legal.privacy;
      case 'terms': return regionConfig.legal.terms;
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
            const region = MULTI_COUNTRY_REGISTRY[code];
            const isActive = code === selectedRegion;
            return (
              <Pressable
                key={code}
                onPress={() => setSelectedRegion(code)}
                style={[
                  styles.regionChip,
                  isActive && styles.regionChipActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Select ${region.name}`}
              >
                <Text style={styles.regionFlag}>{region.flag}</Text>
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
            <Text style={styles.brandName}>Savvymax</Text>
            <View style={styles.regionBadge}>
              <Text style={styles.regionBadgeText}>
                {regionConfig.flag} {regionConfig.code}
              </Text>
            </View>
          </View>
          <Text style={styles.headline} selectable>{regionConfig.uiCopy.headline}</Text>
          <Text style={styles.subheadline}>{regionConfig.uiCopy.subheadline}</Text>
        </View>

        {/* ─── DEPOSIT INPUT ─────────────────────────────────────────── */}
        <View style={styles.depositCard}>
          <Text style={styles.depositLabel}>
            {regionConfig.uiCopy.depositLabel}
          </Text>
          <View style={styles.depositInputRow}>
            <Text style={styles.currencySymbol}>
              {regionConfig.currencySymbol}
            </Text>
            <TextInput
              style={styles.depositInput}
              value={parseInt(depositInput, 10).toLocaleString('en-US')}
              onChangeText={handleDepositChange}
              keyboardType="numeric"
              maxLength={12}
              selectTextOnFocus
              placeholderTextColor="#475569"
              accessibilityLabel="Deposit amount input"
            />
          </View>
          <View style={styles.depositMeta}>
            <View style={styles.liveIndicator} />
            <Text style={styles.depositMetaText}>
              Real-time calculation • {regionConfig.currency}
            </Text>
          </View>
        </View>

        {/* ─── INFLATION BLEED CARD (RED / DANGER) ───────────────────── */}
        <View style={styles.inflationCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconDanger}>
              <Text style={styles.cardIconText}>📉</Text>
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.inflationTitle}>
                {regionConfig.uiCopy.inflationCardTitle}
              </Text>
              <Text style={styles.inflationSubtitle}>
                {regionConfig.inflationRate}% annual inflation rate
              </Text>
            </View>
          </View>

          <View style={styles.inflationStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Annual Loss</Text>
              <Text selectable style={styles.statValueDanger}>
                -{formatCurrency(annualInflationLoss)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Monthly Loss</Text>
              <Text selectable style={styles.statValueDanger}>
                -{formatCurrency(monthlyInflationLoss)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Daily Loss</Text>
              <Text selectable style={styles.statValueDanger}>
                -{formatCurrency(dailyInflationLoss, 2)}
              </Text>
            </View>
          </View>

          {/* Live Ticker */}
          <View style={styles.liveTicker}>
            <View style={styles.liveTickerDot} />
            <Text style={styles.liveTickerLabel}>Lost since page load:</Text>
            <Text selectable style={styles.liveTickerValue}>
              -{formatCurrency(tickerLoss, 6)}
            </Text>
          </View>
        </View>

        {/* ─── OPTIMIZED YIELD CARD (GREEN / SUCCESS) ────────────────── */}
        <View style={styles.yieldCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconSuccess}>
              <Text style={styles.cardIconText}>📈</Text>
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.yieldTitle}>
                {regionConfig.uiCopy.yieldCardTitle}
              </Text>
              <Text style={styles.yieldSubtitle}>
                {regionConfig.optimizedApy}% APY available
              </Text>
            </View>
          </View>

          <View style={styles.yieldStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Annual Yield</Text>
              <Text selectable style={styles.statValueSuccess}>
                +{formatCurrency(annualYield)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Monthly Yield</Text>
              <Text selectable style={styles.statValueSuccess}>
                +{formatCurrency(monthlyYield)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Net Gain (After Inflation)</Text>
              <Text
                selectable
                style={[
                  netGain >= 0 ? styles.statValueSuccess : styles.statValueDanger,
                ]}
              >
                {netGain >= 0 ? '+' : ''}{formatCurrency(netGain)}
              </Text>
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaContainer}>
            <Pressable
              style={styles.ctaButton}
              accessibilityRole="button"
              onPress={() => {
                const url = regionConfig.affiliateUrl || 'https://savvymax.goldsphere.org';
                if (typeof window !== 'undefined') {
                  window.open(url, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <Text style={styles.ctaButtonText}>
                {regionConfig.uiCopy.ctaButton}
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
              onPress={() => openModal('disclaimer')}
              style={styles.linkPressable}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Disclaimer</Text>
            </Pressable>
            <Text style={styles.footerSeparator}>•</Text>
            <Pressable
              onPress={() => openModal('privacy')}
              style={styles.linkPressable}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Privacy Policy</Text>
            </Pressable>
            <Text style={styles.footerSeparator}>•</Text>
            <Pressable
              onPress={() => openModal('terms')}
              style={styles.linkPressable}
              accessibilityRole="button"
            >
              <Text style={styles.link}>Terms of Service</Text>
            </Pressable>
          </View>
          <Text selectable style={styles.copyright}>
            © 2025 Savvymax. All rights reserved. {regionConfig.flag} {regionConfig.name}
          </Text>
        </View>
      </ScrollView>

      {/* ─── LEGAL MODAL OVERLAY ───────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
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
              onPress={() => setModalVisible(false)}
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
    gap: 6,
    paddingHorizontal: 14,
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
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10B981',
  },
  regionFlag: {
    fontSize: 16,
  },
  regionChipText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  regionChipTextActive: {
    color: '#10B981',
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
    backgroundColor: '#10B981',
  },
  brandName: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: '#F3F4F6',
    letterSpacing: -0.3,
  },
  regionBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  regionBadgeText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#10B981',
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
  depositMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  depositMetaText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
  },

  // Inflation Card (Red / Danger)
  inflationCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 20,
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#1F2937',
    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.08)',
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
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconSuccess: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
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
    color: '#EF4444',
  },
  inflationStats: {
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
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
    color: '#EF4444',
    fontVariant: ['tabular-nums'],
  },
  statDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  liveTicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  liveTickerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveTickerLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#94A3B8',
    flex: 1,
  },
  liveTickerValue: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#EF4444',
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
    borderLeftColor: '#10B981',
    borderWidth: 1,
    borderColor: '#1F2937',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)',
  },
  yieldTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: '#F3F4F6',
  },
  yieldSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: '#10B981',
  },
  yieldStats: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderRadius: 12,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
  },
  statValueSuccess: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#10B981',
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
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  closeBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: '#10B981',
  },
});

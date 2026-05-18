import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/Typography';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Panel = 'home' | 'tracker' | 'calculator' | 'perks' | 'trends';
type BottomTab = 'home' | 'inbox' | 'qr' | 'profile';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const COLORS = {
  primary: '#1a73e8',
  primaryDark: '#1557b0',
  white: '#ffffff',
  background: '#f9fafb',
  border: '#e5e7eb',
  text: '#111827',
  textMuted: '#6b7280',
  textLight: '#9ca3af',
  success: '#10b981',
  danger: '#ef4444',
  cardBg: '#ffffff',
};

const BANK_DATA = [
  { name: 'Wealthfront', apy: 5.0, tier: 'Premium' },
  { name: 'BrioDirect', apy: 4.8, tier: 'High-Yield' },
  { name: 'SoFi', apy: 4.6, tier: 'Secured' },
  { name: 'UFB Direct', apy: 4.5, tier: 'Standard' },
];

const APY_OPTIONS = [
  { label: 'Wealthfront 5.0%', value: 5.0 },
  { label: 'SoFi 4.6%', value: 4.6 },
  { label: 'Market Average 4.5%', value: 4.5 },
];

// ─── PULSING DOT COMPONENT ──────────────────────────────────────────────────

function PulsingDot({ size = 8 }: { size?: number }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2.5,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ position: 'absolute', top: -2, right: -2, width: size + 8, height: size + 8, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size + 4,
          height: size + 4,
          borderRadius: (size + 4) / 2,
          backgroundColor: COLORS.danger,
          opacity: opacityAnim,
          transform: [{ scale: pulseAnim }],
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: COLORS.danger,
        }}
      />
    </View>
  );
}

// ─── PULSING BUTTON COMPONENT ────────────────────────────────────────────────

function PulsingButton({
  title,
  onPress,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'dark';
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bgColor = variant === 'dark' ? '#1f2937' : COLORS.primary;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.ctaButton,
          { backgroundColor: bgColor, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={styles.ctaButtonText}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── CREDIT SCORE DIAL ───────────────────────────────────────────────────────

function CreditScoreDial({ score }: { score: number }) {
  // Semi-circle dial - score from 300 to 850
  const percentage = ((score - 300) / (850 - 300)) * 100;
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <View style={styles.dialContainer}>
      <View style={styles.dialOuter}>
        <View style={styles.dialTrack} />
        <View style={[styles.dialFill, { transform: [{ rotate: `${rotation}deg` }] }]}>
          <View style={styles.dialNeedle} />
        </View>
        <View style={styles.dialCenter}>
          <Text style={styles.dialScore}>{score}</Text>
          <Text style={styles.dialLabel}>Excellent</Text>
        </View>
      </View>
    </View>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function SavvymaxDashboard() {
  const insets = useSafeAreaInsets();
  const [activePanel, setActivePanel] = useState<Panel>('home');
  const [activeTab, setActiveTab] = useState<BottomTab>('home');

  // Calculator state
  const [principal, setPrincipal] = useState('10000');
  const [selectedApyIndex, setSelectedApyIndex] = useState(0);

  const calculatedReturn = useMemo(() => {
    const amount = parseFloat(principal.replace(/[^0-9.]/g, '')) || 0;
    const apy = APY_OPTIONS[selectedApyIndex].value;
    return (amount * apy / 100).toFixed(2);
  }, [principal, selectedApyIndex]);

  const navigateToPanel = useCallback((panel: Panel) => {
    setActivePanel(panel);
    if (panel === 'home') setActiveTab('home');
  }, []);

  const handleTabPress = useCallback((tab: BottomTab) => {
    setActiveTab(tab);
    if (tab === 'home') setActivePanel('home');
  }, []);

  // ─── RENDER PANELS ──────────────────────────────────────────────────────────

  const renderHomePanel = () => (
    <View style={styles.panelContent}>
      {/* Wallet Card */}
      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Total Tracking Balance</Text>
        <Text style={styles.walletBalance}>$12,345.67</Text>
        <View style={styles.apyPill}>
          <Text style={styles.apyPillText}>+ 4.5% APY</Text>
        </View>
      </View>

      {/* AdSense Banner */}
      <View style={styles.adBanner}>
        <Text style={styles.adText}>[ AdSense Responsive Banner ]</Text>
      </View>

      {/* Service Grid */}
      <View style={styles.serviceGrid}>
        <Pressable
          style={styles.serviceItem}
          onPress={() => navigateToPanel('tracker')}
        >
          <View style={styles.serviceIconWrap}>
            <Text style={styles.serviceIcon}>📊</Text>
            <PulsingDot size={6} />
          </View>
          <Text style={styles.serviceLabel}>Tracker</Text>
        </Pressable>
        <Pressable
          style={styles.serviceItem}
          onPress={() => navigateToPanel('calculator')}
        >
          <View style={styles.serviceIconWrap}>
            <Text style={styles.serviceIcon}>🧮</Text>
          </View>
          <Text style={styles.serviceLabel}>Calculator</Text>
        </Pressable>
        <Pressable
          style={styles.serviceItem}
          onPress={() => navigateToPanel('perks')}
        >
          <View style={styles.serviceIconWrap}>
            <Text style={styles.serviceIcon}>💎</Text>
          </View>
          <Text style={styles.serviceLabel}>Perks</Text>
        </Pressable>
        <Pressable
          style={styles.serviceItem}
          onPress={() => navigateToPanel('trends')}
        >
          <View style={styles.serviceIconWrap}>
            <Text style={styles.serviceIcon}>📈</Text>
          </View>
          <Text style={styles.serviceLabel}>Trends</Text>
        </Pressable>
      </View>

      {/* SoFi Card */}
      <View style={styles.promoCard}>
        <View style={styles.promoHeader}>
          <Text style={styles.promoTitle}>SoFi Checking & Savings</Text>
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>4.6% APY Secured</Text>
          </View>
        </View>
        <Text style={styles.promoDescription}>
          Earn up to 4.6% APY on savings with no account fees. FDIC insured up to $2M through partner banks.
        </Text>
        <PulsingButton
          title="Open Account"
          onPress={() => Linking.openURL('https://sofi.com/banking')}
        />
      </View>

      {/* Wealthfront Card */}
      <View style={styles.promoCard}>
        <View style={styles.promoHeader}>
          <Text style={styles.promoTitle}>Wealthfront Cash Account</Text>
          <View style={[styles.promoBadge, { backgroundColor: '#ecfdf5' }]}>
            <Text style={[styles.promoBadgeText, { color: '#059669' }]}>5.0% APY Tier</Text>
          </View>
        </View>
        <Text style={styles.promoDescription}>
          Industry-leading 5.0% APY with no minimum balance. Automated savings features included.
        </Text>
        <PulsingButton
          title="Claim High Yield"
          onPress={() => Linking.openURL('https://wealthfront.com/cash')}
          variant="dark"
        />
      </View>

      {/* Credit Score Card */}
      <View style={styles.promoCard}>
        <Text style={styles.promoTitle}>Credit Score Optimizer</Text>
        <CreditScoreDial score={758} />
        <PulsingButton
          title="View Free Credit Score"
          onPress={() => {}}
        />
      </View>
    </View>
  );

  const renderTrackerPanel = () => (
    <View style={styles.panelContent}>
      <Text style={styles.panelTitle}>APY Rate Tracker</Text>
      <Text style={styles.panelSubtitle}>Ranked by highest annual percentage yield</Text>

      {BANK_DATA.map((bank, index) => (
        <View key={bank.name} style={styles.trackerRow}>
          <View style={styles.trackerRank}>
            <Text style={styles.trackerRankText}>#{index + 1}</Text>
          </View>
          <View style={styles.trackerInfo}>
            <Text style={styles.trackerName}>{bank.name}</Text>
            <Text style={styles.trackerTier}>{bank.tier}</Text>
          </View>
          <View style={styles.trackerApyBadge}>
            <Text style={styles.trackerApyText}>{bank.apy.toFixed(2)}%</Text>
          </View>
        </View>
      ))}

      <Pressable
        style={styles.returnButton}
        onPress={() => navigateToPanel('home')}
      >
        <Text style={styles.returnButtonText}>Return to Dashboard</Text>
      </Pressable>
    </View>
  );

  const renderCalculatorPanel = () => (
    <View style={styles.panelContent}>
      <Text style={styles.panelTitle}>APY Calculator</Text>
      <Text style={styles.panelSubtitle}>See your potential annual earnings</Text>

      <View style={styles.calcCard}>
        <Text style={styles.calcLabel}>Principal Amount ($)</Text>
        <TextInput
          style={styles.calcInput}
          value={principal}
          onChangeText={setPrincipal}
          keyboardType="numeric"
          placeholder="Enter amount"
          placeholderTextColor={COLORS.textLight}
        />

        <Text style={[styles.calcLabel, { marginTop: 16 }]}>Select APY Rate</Text>
        <View style={styles.apySelector}>
          {APY_OPTIONS.map((option, idx) => (
            <Pressable
              key={option.label}
              style={[
                styles.apyOption,
                selectedApyIndex === idx && styles.apyOptionActive,
              ]}
              onPress={() => setSelectedApyIndex(idx)}
            >
              <Text
                style={[
                  styles.apyOptionText,
                  selectedApyIndex === idx && styles.apyOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.calcResult}>
          <Text style={styles.calcResultLabel}>Annual Return</Text>
          <Text style={styles.calcResultValue}>${calculatedReturn}</Text>
        </View>
      </View>

      <Pressable
        style={styles.returnButton}
        onPress={() => navigateToPanel('home')}
      >
        <Text style={styles.returnButtonText}>Return to Dashboard</Text>
      </Pressable>
    </View>
  );

  const renderPerksPanel = () => (
    <View style={styles.panelContent}>
      <Text style={styles.panelTitle}>Exclusive Perks</Text>
      <Text style={styles.panelSubtitle}>Limited-time offers for Savvymax users</Text>

      <View style={styles.perkCard}>
        <View style={styles.perkBadge}>
          <Text style={styles.perkBadgeText}>LIMITED OFFER</Text>
        </View>
        <Text style={styles.perkTitle}>SoFi $300 Cash Bonus</Text>
        <Text style={styles.perkDescription}>
          Open a new SoFi Checking & Savings account with direct deposit of $5,000+ within 25 days and earn a $300 cash bonus. Plus earn up to 4.6% APY on savings.
        </Text>
        <View style={styles.perkDetails}>
          <View style={styles.perkDetailRow}>
            <Text style={styles.perkDetailIcon}>✓</Text>
            <Text style={styles.perkDetailText}>No account fees</Text>
          </View>
          <View style={styles.perkDetailRow}>
            <Text style={styles.perkDetailIcon}>✓</Text>
            <Text style={styles.perkDetailText}>FDIC insured up to $2M</Text>
          </View>
          <View style={styles.perkDetailRow}>
            <Text style={styles.perkDetailIcon}>✓</Text>
            <Text style={styles.perkDetailText}>Free ATM access at 55,000+ locations</Text>
          </View>
        </View>
        <PulsingButton
          title="Claim $300 Bonus"
          onPress={() => Linking.openURL('https://sofi.com/banking')}
        />
      </View>

      <Pressable
        style={styles.returnButton}
        onPress={() => navigateToPanel('home')}
      >
        <Text style={styles.returnButtonText}>Return to Dashboard</Text>
      </Pressable>
    </View>
  );

  const renderTrendsPanel = () => (
    <View style={styles.panelContent}>
      <Text style={styles.panelTitle}>Market Trends</Text>
      <Text style={styles.panelSubtitle}>APY rate movements and analytics</Text>

      <View style={styles.trendsPlaceholder}>
        <Text style={styles.trendsIcon}>📈</Text>
        <Text style={styles.trendsTitle}>Analytics Dashboard</Text>
        <Text style={styles.trendsDescription}>
          Real-time APY trend data, Federal Reserve rate predictions, and personalized savings optimization insights coming soon.
        </Text>
        <View style={styles.trendsStats}>
          <View style={styles.trendsStat}>
            <Text style={styles.trendsStatValue}>4.5%</Text>
            <Text style={styles.trendsStatLabel}>Avg. APY</Text>
          </View>
          <View style={styles.trendsDivider} />
          <View style={styles.trendsStat}>
            <Text style={styles.trendsStatValue}>+0.25%</Text>
            <Text style={styles.trendsStatLabel}>30d Change</Text>
          </View>
          <View style={styles.trendsDivider} />
          <View style={styles.trendsStat}>
            <Text style={styles.trendsStatValue}>12</Text>
            <Text style={styles.trendsStatLabel}>Banks Tracked</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.returnButton}
        onPress={() => navigateToPanel('home')}
      >
        <Text style={styles.returnButtonText}>Return to Dashboard</Text>
      </Pressable>
    </View>
  );

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'home': return renderHomePanel();
      case 'tracker': return renderTrackerPanel();
      case 'calculator': return renderCalculatorPanel();
      case 'perks': return renderPerksPanel();
      case 'trends': return renderTrendsPanel();
    }
  };

  // ─── MAIN RENDER ────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerBrand}>SAVVYMAX</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>v2.0 Live</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderActivePanel()}
      </ScrollView>

      {/* Fixed Bottom Ad */}
      <View style={styles.fixedAdBanner}>
        <Text style={styles.fixedAdText}>[ Mobile Fixed Bottom Floating Ad ]</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <Pressable
          style={styles.navItem}
          onPress={() => handleTabPress('home')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Home
          </Text>
          {activeTab === 'home' && <View style={styles.navIndicator} />}
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => handleTabPress('inbox')}
        >
          <View>
            <Text style={styles.navIcon}>📩</Text>
            <PulsingDot size={6} />
          </View>
          <Text style={[styles.navLabel, activeTab === 'inbox' && styles.navLabelActive]}>
            Inbox
          </Text>
          {activeTab === 'inbox' && <View style={styles.navIndicator} />}
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => handleTabPress('qr')}
        >
          <Text style={styles.navIcon}>🔲</Text>
          <Text style={[styles.navLabel, activeTab === 'qr' && styles.navLabelActive]}>
            QR Scanner
          </Text>
          {activeTab === 'qr' && <View style={styles.navIndicator} />}
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => handleTabPress('profile')}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
            Profile
          </Text>
          {activeTab === 'profile' && <View style={styles.navIndicator} />}
        </Pressable>
      </View>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    boxShadow: '0 0 24px rgba(0,0,0,0.08)',
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerBrand: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: COLORS.white,
    letterSpacing: 1.5,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: COLORS.white,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // Panel Content
  panelContent: {
    padding: 16,
    gap: 16,
  },

  // Wallet Card
  walletCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderCurve: 'continuous',
    backgroundImage: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
  },
  walletLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  walletBalance: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: COLORS.white,
    fontVariant: ['tabular-nums'],
  },
  apyPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  apyPillText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
    color: COLORS.white,
  },

  // Ad Banner
  adBanner: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  adText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Service Grid
  serviceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    borderCurve: 'continuous',
    minHeight: 80,
    justifyContent: 'center',
  },
  serviceIconWrap: {
    position: 'relative',
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceLabel: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: COLORS.text,
    textAlign: 'center',
  },

  // Promo Cards
  promoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderCurve: 'continuous',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  promoTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  promoBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  promoBadgeText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: COLORS.primary,
  },
  promoDescription: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
  },

  // CTA Button
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderCurve: 'continuous',
  },
  ctaButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: COLORS.white,
  },

  // Credit Dial
  dialContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dialOuter: {
    width: 160,
    height: 90,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  dialTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: '#e5e7eb',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '0deg' }],
  },
  dialFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: COLORS.success,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '0deg' }],
  },
  dialNeedle: {
    position: 'absolute',
    bottom: 78,
    left: 76,
    width: 4,
    height: 50,
    backgroundColor: COLORS.text,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  dialCenter: {
    alignItems: 'center',
    marginBottom: 4,
  },
  dialScore: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  dialLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: COLORS.success,
    marginTop: 2,
  },

  // Tracker Panel
  panelTitle: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: COLORS.text,
  },
  panelSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: -8,
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderCurve: 'continuous',
  },
  trackerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerRankText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: COLORS.primary,
  },
  trackerInfo: {
    flex: 1,
    gap: 2,
  },
  trackerName: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: COLORS.text,
  },
  trackerTier: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  trackerApyBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trackerApyText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#059669',
    fontVariant: ['tabular-nums'],
  },

  // Calculator Panel
  calcCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderCurve: 'continuous',
  },
  calcLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  calcInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  apySelector: {
    gap: 8,
  },
  apyOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#f9fafb',
    borderCurve: 'continuous',
  },
  apyOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#eff6ff',
  },
  apyOptionText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  apyOptionTextActive: {
    color: COLORS.primary,
  },
  calcResult: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    gap: 4,
  },
  calcResultLabel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  calcResultValue: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: COLORS.success,
    fontVariant: ['tabular-nums'],
  },

  // Perks Panel
  perkCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderCurve: 'continuous',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  perkBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  perkBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: '#92400e',
    letterSpacing: 0.5,
  },
  perkTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  perkDescription: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  perkDetails: {
    gap: 8,
    paddingVertical: 4,
  },
  perkDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkDetailIcon: {
    fontSize: 14,
    color: COLORS.success,
    fontFamily: Fonts.bold,
  },
  perkDetailText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: COLORS.text,
  },

  // Trends Panel
  trendsPlaceholder: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    borderCurve: 'continuous',
  },
  trendsIcon: {
    fontSize: 48,
  },
  trendsTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  trendsDescription: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  trendsStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    width: '100%',
    marginTop: 8,
  },
  trendsStat: {
    alignItems: 'center',
    gap: 2,
  },
  trendsStatValue: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  trendsStatLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  trendsDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },

  // Return Button
  returnButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderCurve: 'continuous',
    marginTop: 8,
  },
  returnButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: COLORS.textMuted,
  },

  // Fixed Ad Banner
  fixedAdBanner: {
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  fixedAdText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: COLORS.textLight,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
    minHeight: 44,
    position: 'relative',
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  navLabelActive: {
    color: COLORS.primary,
  },
  navIndicator: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 1.5,
  },
});
